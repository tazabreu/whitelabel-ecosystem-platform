# Java Logging Configuration

Structured JSON logging for Java/Spring Boot services.

## Logback Configuration

Use `logstash-logback-encoder` for JSON output:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <!-- JSON encoder for structured logging -->
    <appender name="CONSOLE_JSON" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <customFields>{"service":"${SERVICE_NAME:-unknown}"}</customFields>
            <fieldNames>
                <timestamp>timestamp</timestamp>
                <version>[ignore]</version>
            </fieldNames>
            <!-- Include MDC fields (journeyId, userEcosystemId, etc.) -->
            <includeMdcKeyName>journeyId</includeMdcKeyName>
            <includeMdcKeyName>userEcosystemId</includeMdcKeyName>
            <includeMdcKeyName>traceId</includeMdcKeyName>
            <includeMdcKeyName>spanId</includeMdcKeyName>
        </encoder>
    </appender>

    <!-- Plain text for local development -->
    <appender name="CONSOLE_PLAIN" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg [journeyId=%X{journeyId}]%n</pattern>
        </encoder>
    </appender>

    <!-- Use JSON in production, plain in local -->
    <springProfile name="local,default">
        <root level="INFO">
            <appender-ref ref="CONSOLE_PLAIN"/>
        </root>
    </springProfile>

    <springProfile name="!local,!default">
        <root level="INFO">
            <appender-ref ref="CONSOLE_JSON"/>
        </root>
    </springProfile>
</configuration>
```

## Dependencies

```kotlin
// build.gradle.kts
implementation("net.logstash.logback:logstash-logback-encoder:8.0")
```

## MDC Usage

Always include correlation context in MDC:

```java
import org.slf4j.MDC;

// In a filter or interceptor
MDC.put("journeyId", journeyId);
MDC.put("userEcosystemId", userEcosystemId);
MDC.put("traceId", traceId);
MDC.put("spanId", spanId);

try {
    // Process request
} finally {
    MDC.clear();
}
```

## Example Log Output

### JSON (Production)

```json
{
  "timestamp": "2025-12-19T10:30:45.123Z",
  "level": "INFO",
  "logger_name": "com.ecosystem.webbff.UserController",
  "message": "User login successful",
  "service": "web-bff",
  "journeyId": "jrn_V1StGXR8_Z5jdHi6B-myT",
  "userEcosystemId": "usr_demo_user_001",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "spanId": "00f067aa0ba902b7"
}
```

### Plain Text (Local)

```
10:30:45.123 [http-nio-8080-exec-1] INFO  c.e.webbff.UserController - User login successful [journeyId=jrn_V1StGXR8_Z5jdHi6B-myT]
```

## Best Practices

1. **Use structured logging** - Log fields, not string concatenation
2. **Include context** - Always add journeyId and userEcosystemId to MDC
3. **Log at appropriate levels**:
   - ERROR: Unexpected failures requiring attention
   - WARN: Recoverable issues, degraded behavior
   - INFO: Significant business events
   - DEBUG: Detailed diagnostic information
4. **Avoid logging sensitive data** - Never log passwords, tokens, PII

