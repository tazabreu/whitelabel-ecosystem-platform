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

    // OpenTelemetry
    implementation("io.opentelemetry:opentelemetry-api:1.44.1")
    implementation("io.opentelemetry:opentelemetry-sdk:1.44.1")
    implementation("io.opentelemetry:opentelemetry-exporter-otlp:1.44.1")
    implementation("io.opentelemetry.instrumentation:opentelemetry-spring-boot-starter:2.10.0")

    // JSON Logging
    implementation("net.logstash.logback:logstash-logback-encoder:8.0")

    // WebClient for inter-service calls
    implementation("org.springframework.boot:spring-boot-starter-webflux")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

