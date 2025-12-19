# Multi-stage build for Spring Boot Web BFF
FROM gradle:8.5-jdk21-alpine AS builder
WORKDIR /app
COPY build.gradle.kts settings.gradle.kts ./
COPY src ./src
RUN gradle build -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SPRING_PROFILES_ACTIVE=docker

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

