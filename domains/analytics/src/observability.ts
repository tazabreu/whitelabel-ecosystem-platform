import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
} from "@opentelemetry/semantic-conventions";

const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || "analytics-service";
const OTLP_ENDPOINT =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318";
const ENVIRONMENT = process.env.DEPLOYMENT_ENVIRONMENT || "local";

const resource = new Resource({
  [ATTR_SERVICE_NAME]: SERVICE_NAME,
  "deployment.environment": ENVIRONMENT,
});

const traceExporter = new OTLPTraceExporter({
  url: `${OTLP_ENDPOINT}/v1/traces`,
});

export const otelSdk = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable some noisy instrumentations
      "@opentelemetry/instrumentation-fs": { enabled: false },
    }),
  ],
});

/**
 * Initialize OpenTelemetry SDK.
 * Call this before importing any other modules that need instrumentation.
 */
export function initializeObservability(): void {
  otelSdk.start();

  // Graceful shutdown
  process.on("SIGTERM", () => {
    otelSdk
      .shutdown()
      .then(() => console.log("OpenTelemetry SDK shut down"))
      .catch((error) => console.error("Error shutting down SDK", error))
      .finally(() => process.exit(0));
  });
}

