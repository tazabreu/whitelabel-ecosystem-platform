import pg from "pg";
import { logger } from "../logger.js";

const { Pool } = pg;

// Database connection pool
let pool: pg.Pool | null = null;

function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.ANALYTICS_DB_HOST || "localhost",
      port: parseInt(process.env.ANALYTICS_DB_PORT || "5434", 10),
      database: process.env.ANALYTICS_DB_NAME || "analytics_db",
      user: process.env.ANALYTICS_DB_USER || "postgres",
      password: process.env.ANALYTICS_DB_PASSWORD || "postgres",
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on("error", (err) => {
      logger.error({ err }, "Unexpected error on idle client");
    });
  }
  return pool;
}

export interface AnalyticsEvent {
  eventId?: string;
  eventName: string;
  domain: string;
  entity?: string;
  action?: string;
  timestamp?: string;
  journeyId?: string;
  userEcosystemId?: string;
  traceId?: string;
  spanId?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Save an analytics event to the database.
 */
export async function saveAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  const pool = getPool();

  const query = `
    INSERT INTO analytics_events (
      event_id, event_name, domain, entity, action,
      timestamp, journey_id, user_ecosystem_id,
      trace_id, span_id, source, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    ON CONFLICT (event_id) DO NOTHING
  `;

  const values = [
    event.eventId,
    event.eventName,
    event.domain,
    event.entity || null,
    event.action || null,
    event.timestamp || new Date().toISOString(),
    event.journeyId,
    event.userEcosystemId || null,
    event.traceId || null,
    event.spanId || null,
    event.source || null,
    JSON.stringify(event.metadata || {}),
  ];

  try {
    await pool.query(query, values);
    logger.debug({ eventId: event.eventId }, "Analytics event saved");
  } catch (error) {
    logger.error({ error, eventId: event.eventId }, "Failed to save analytics event");
    throw error;
  }
}

/**
 * Get events by journey ID for tracing.
 */
export async function getEventsByJourneyId(
  journeyId: string
): Promise<AnalyticsEvent[]> {
  const pool = getPool();

  const query = `
    SELECT 
      event_id as "eventId",
      event_name as "eventName",
      domain,
      entity,
      action,
      timestamp,
      journey_id as "journeyId",
      user_ecosystem_id as "userEcosystemId",
      trace_id as "traceId",
      span_id as "spanId",
      source,
      metadata
    FROM analytics_events
    WHERE journey_id = $1
    ORDER BY timestamp ASC
  `;

  const result = await pool.query(query, [journeyId]);
  return result.rows;
}

/**
 * Update or create a journey record.
 */
export async function upsertJourney(
  journeyId: string,
  userEcosystemId?: string
): Promise<void> {
  const pool = getPool();

  const query = `
    INSERT INTO journeys (journey_id, user_ecosystem_id, started_at, event_count)
    VALUES ($1, $2, NOW(), 1)
    ON CONFLICT (journey_id) DO UPDATE
    SET event_count = journeys.event_count + 1,
        updated_at = NOW()
  `;

  await pool.query(query, [journeyId, userEcosystemId || null]);
}

/**
 * Close the database pool (for graceful shutdown).
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

