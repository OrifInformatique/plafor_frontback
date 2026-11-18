# Base stage
FROM maven:3.9-amazoncorretto-25-alpine AS base
WORKDIR /app

# Copy only the POM file first
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Development stage
FROM base AS dev
# Copy the downloaded dependencies from the base stage
COPY --from=base /root/.m2 /root/.m2
# Copy the rest of your application code
COPY . .
CMD ["mvn", "spring-boot:run", "-DskipTests"]

# Testing stage
FROM base AS test
COPY . .
CMD ["mvn", "test"]

# Production stage
FROM base AS prod
COPY . .
RUN mvn clean package -DskipTests
COPY --from=base /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]

