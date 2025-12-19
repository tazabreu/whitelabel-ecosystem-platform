plugins {
    java
    id("org.springframework.boot") version "3.4.0"
    id("io.spring.dependency-management") version "1.1.6"
}

group = "com.ecosystem"
version = "0.1.0"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")

    // PostgreSQL
    runtimeOnly("org.postgresql:postgresql")

    // Kafka/Redpanda
    implementation("org.springframework.kafka:spring-kafka")

    // OpenTelemetry
    implementation("io.opentelemetry:opentelemetry-api:1.44.1")
    implementation("io.opentelemetry:opentelemetry-sdk:1.44.1")
    implementation("io.opentelemetry:opentelemetry-exporter-otlp:1.44.1")
    implementation("io.opentelemetry.instrumentation:opentelemetry-spring-boot-starter:2.10.0")

    // JSON Logging
    implementation("net.logstash.logback:logstash-logback-encoder:8.0")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.kafka:spring-kafka-test")
    testImplementation("com.h2database:h2")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

