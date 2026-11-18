
# Spring template
<p>
    <div style="text-align: center;">
        <img src="https://sectioninformatique.ch/wp-content/uploads/2021/09/Logo_Orif__70.jpg" width=40% height=40% alt="Orif logo"></a>
        <img src="src/main/resources/static/images/spring_boot.svg" width="271" height="70" alt="Spring Boot logo">
    </div>
</p>

Template to start developing a new REST API application with Spring Boot.

## Documentation

| Document | Scope |
| -------- | ----- |
| **This README** | Setup, Docker, Maven, OAuth2 overview |
| [../docs/process-documentation.md](../docs/process-documentation.md) | Application architecture, modules, security, database, `spring-auth` integration |
| [../docs/api-documentation-generation.md](../docs/api-documentation-generation.md) | Spring REST Docs pipeline (snippets, Asciidoctor, maintenance) |
| [../docs/index.html](../docs/index.html) | Generated API reference (endpoints, request/response examples) |
| [../docs/process/](../docs/process/) | Draw.io diagrams for the REST Docs pipeline (`restdocs-pipeline.drawio`, `restdocs-generation.drawio`) |

# Table of Contents
- [Spring template](#spring-template)
- [Documentation](#documentation)
- [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment variables and application properties](#environment-variables-and-application-properties)
  - [Docker](#docker)
    - [Run dev environment using docker](#run-dev-environment-using-docker)
    - [Run test environment using docker](#run-test-environment-using-docker)
    - [Do actions from within Docker (CLI)](#do-actions-from-within-docker-cli)
  - [What's next ?](#whats-next)
  - [Microsoft Entra Azure AD oAuth2](#microsoft-entra-azure-ad-oauth2)
  - [Commands cheat-sheet](#commands-cheat-sheet)
    - [Simplified sequence diagram](#simplified-sequence-diagram)
  - [API documentation](#api-documentation)
- [Sources](#sources)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
The Spring Boot version currently used in this project is 3.3.5.

The project's environment must contain these tools. Make sure that your Windows or WSL environnment variables contain the path to Java.

- [Java / openJDK 21](https://adoptium.net/fr/temurin/releases/)
- [Maven 3.9](https://maven.apache.org/docs/history.html)
- [MariaDB 11.4](https://mariadb.org/mariadb/all-releases/). A MySQL equivalent can also be installed with [Laragon](https://laragon.org/download/)

#### Optionnal

It is recommended to develop the app using docker.
This is not a hard requirement but it's highly encouraged.
For more info, head to the [Docker section](#docker) of this documentation.

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker-compose](https://docs.docker.com/compose/)
- On linux or WSL (Included in Docker desktop): [Docker-buildx](https://github.com/docker/buildx)

### Environment variables and application properties

#### `.env` file
This file is used by Docker to configure the containers. The environment variables defined in `.env` can be transmitted to the container and the Spring Boot app through the `compose.yml` file.

1. DON'T modify the `env-dist` file but make a copy of it in the backend root folder.
2. Rename your copied file to `.env`.
3. If needed, change the values of the environment variables defined.

`.env` file defines :
- The environment (dev, test or prod)
- The port to use for the Spring Boot app container
- The dev or test database URL and credentials. Prod database informations should only be defined as environment variables in the production environment

#### `application.properties` files
These files are used by Spring Boot to configure the application. They can contain hard code values or use environment variables as values.

The `application.properties` file located in the backend root folder is git ignored and let's you define configurations specific to your local environment or informations that must not be synchronized in the GIT repository. Secret keys for example.

1. DON'T modify the `application.properties-dist` file but make a copy of it in the backend root folder.
2. Rename your copied file to `application.properties`.
3. Open the file in you IDE and set the configurations you want. They will override the configurations defined in the src/main/resources folder.

## Docker

In this app, we use docker-compose, a Docker wrapper.
It allows you and other programmers to work in a same development or testing environment, starting a database container and a Spring Boot app container wich are working together.

The main commands you'll have to use are described in the [commands cheat-sheet](#commands-cheat-sheet) sub-section.

### Run dev environment using docker
First, you need to build the containers :

1. Make sure `ENVIRONMENT=dev` is set in `.env` !
2. In the `backend` folder, use the command `docker compose build`
3. Now that the containers have been built, you can start them with `docker compose up`

Note that each time you change the `ENVIRONMENT` variables, you need to use
the command `docker compose build`.

### Run test environment using docker
1. Make sure `ENVIRONMENT=test` is set in `.env` !
2. If needed, reset containers and volumes (datas) with `docker compose down -v`
3. In the `backend` folder, use the command `docker compose build`
4. Now that the containers have been built, you can start them with `docker compose up`

### Do actions from within Docker (CLI)

To manipulate your application from within a container, you simply need to
enter it using the command `docker exec -it <container name> sh`.

You're now using the container's terminal.

## What's next ?

Feel free to explore the code and create your own experiment branch to
learn about Spring Boot !

The item module is here as an example of how to create your own modules.

## Commands cheat-sheet

Here is a list of the most common commands you'll likely use !

### Docker
Build containers
`docker compose build`

Start containers
`docker compose up`

run in background
`docker compose up -d`

Enter a container with shell
`docker exec -it <container name> sh`

### Maven
Run the app
`mvn spring-boot:run`

Downloads all the dependencies without building or compiling the app
`mvn dependency:resolve`

Same as `mvn dependency:resolve` but displays the dependency tree
`mvn dependency:tree`

Removes the previously built artefacts and .JAR file
`mvn clean`

Build the project into a .JAR file
`mvn package`

Check if the project's structure is valid
`mvn validate`

## Microsoft Entra Azure AD oAuth2

### Simplified sequence diagram
<p>
    <img src="src/main/resources/static/images/oauth2_sequence_diagram.png" alt="simplified oAuth 2 sequence diagram">
</p>

## API documentation

HTTP documentation for the template backend (`/auth`, `/users`, `/tests`, `/roles`, `/items`) is generated automatically from integration tests with **Spring REST Docs** and published as [../docs/index.html](../docs/index.html).

- **AsciiDoc template:** `src/asciidoc/index.adoc` (structure and snippet includes)
- **Snippets:** produced during tests under `target/generated-snippets/`
- **HTML:** built by Asciidoctor at `mvn package` into `target/generated-snippets-html/`
- **Contracts:** `RestDocsSnippets` (JSON field checks on happy paths)
- **Masking:** `RestDocsSensitiveDataMasking` replaces JWT and refresh-token values in snippets before HTML is built

For the full pipeline, diagrams, and maintenance rules, see [../docs/api-documentation-generation.md](../docs/api-documentation-generation.md). Process diagrams live under [../docs/process/](../docs/process/).

Quick start from `backend/` on the host (MariaDB in Docker, Maven on the host). Copy `env-dist` to `.env` first if you have not already (default dev credentials live there; do not reuse them in production):

```bash
docker compose up -d db

set -a
source .env
set +a

# On the host, use localhost instead of the Docker service name "db"
export TEST_SPRING_DATASOURCE_URL="${TEST_SPRING_DATASOURCE_URL//:\/\/db:/:\/\/localhost:}"
export SPRING_DATASOURCE_USERNAME="$DB_USERNAME"
export SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD"

mvn -Dspring.profiles.active=test clean verify
mvn -Dspring.profiles.active=test clean package
cp target/generated-snippets-html/index.html ../docs/index.html
```

Run only the REST Docs-related tests:

```bash
mvn -Dspring.profiles.active=test test -Dtest=RestDocsSensitiveDataMaskingTest
mvn -Dspring.profiles.active=test test -Dtest=AuthControllerTest,UserControllerTest,TestControllerTest,RoleControllerTest,ItemControllerTest
```

After an API change: update the integration tests and `RestDocsSnippets` if payloads change, regenerate snippets and HTML, then commit `docs/index.html` if the published reference must follow.

## Sources

[Microsoft oAuth2 grant flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)

---
