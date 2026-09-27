FROM maven:3.9.9-eclipse-temurin-11 AS build
WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw mvnw
COPY src src

RUN chmod +x mvnw && ./mvnw -DskipTests clean package

FROM eclipse-temurin:11-jre
WORKDIR /app

COPY --from=build /app/target/pharmacy-backend-1.0.0.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
