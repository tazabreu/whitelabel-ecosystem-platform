-- Analytics Service: Initial schema
-- V001: Create analytics tables

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(100) NOT NULL UNIQUE,
    event_name VARCHAR(100) NOT NULL,
    domain VARCHAR(50) NOT NULL,
    entity VARCHAR(100),
    action VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    journey_id VARCHAR(50) NOT NULL,
    user_ecosystem_id VARCHAR(50),
    trace_id VARCHAR(64),
    span_id VARCHAR(32),
    source VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common query patterns
CREATE INDEX idx_analytics_events_journey ON analytics_events(journey_id);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_ecosystem_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_events_domain ON analytics_events(domain);
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);

-- GIN index for JSONB metadata queries
CREATE INDEX idx_analytics_events_metadata ON analytics_events USING GIN(metadata);

-- Journeys (aggregated view)
CREATE TABLE IF NOT EXISTS journeys (
    id BIGSERIAL PRIMARY KEY,
    journey_id VARCHAR(50) NOT NULL UNIQUE,
    user_ecosystem_id VARCHAR(50),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    event_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_journeys_user ON journeys(user_ecosystem_id);
CREATE INDEX idx_journeys_started ON journeys(started_at);

COMMENT ON TABLE analytics_events IS 'Raw analytics events from all ecosystem services';
COMMENT ON TABLE journeys IS 'Aggregated journey information for analytics';

