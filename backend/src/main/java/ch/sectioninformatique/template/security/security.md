# SECURITY PACKAGE

## Table of Contents
- [CustomAccessDenierHandler.java](#customaccessdenierhandlerjava)

    - [handle()](#handle)

- [JwtAuthFilter.java](#jwtauthfilterjava)

    - [doFilterInternal()](#dofilterinternal)
    - [Error Handling](#error-handling)
    - [sendErrorResponse()](#senderrorresponse)
    - [getMessage()](#getmessage)

- [PermissionEnum.java](#permissionenumjava)
- [Role.java](#rolejava)
- [RoleEnum.java](#roleenumjava)
- [RoleRepository.java](#rolerepositoryjava)

    - [findByName()](#findbyname)

- [RoleSeeder.java](#roleseederjava)

    - [loadRoles()](#loadroles)

- [SecurityConfig.java](#securityconfigjava)

    - [securityFilterChain()](#securityfilterchain)
    - [CORS](#cors)
    - [Authorization](#authorization)
    - [Error Handling](#error-handling-1)

- [SecurityExceptions.java](#securityexceptionsjava)

    - [Token exceptions](#token-exceptions)
    - [Authorization exceptions](#authorization-exceptions)
    - [Authentication and configuration exceptions](#authentication-and-configuration-exceptions)

- [UserAuthenticationEntryPoint.java](#userauthenticationentrypointjava)

    - [commence()](#commence)
    - [getMessage](#getmessage-1)

- [UserAuthenticationProvider.java](#userauthenticationproviderjava)

    - [init()](#init)
    - [createToken()](#createtoken)
    - [buildAuthorities()](#buildauthorities)
    - [validateToken()](#validatetoken)
    - [Error Handling](#error-handling-2)

- [WebClientConfig.java](#webclientconfigjava)
    - [webClient()](#webclient)
- [WebConfig.java](#webconfigjava)
    - [corsFilter()](#corsfilter)

## *CustomAccessDenierHandler.java*

`CustomAccessDeniedHandler` is a security component used to handle requests where an authenticated user does not have the required permissions.

It implements Spring Security's `AccessDeniedHandler` and returns an HTTP `403 FORBIDDEN` response.

It contains :

* `handle()`,
* `messageSource`,
* `OBJECT_MAPPER`

### `handle()`

Handles `AccessDeniedException` when access to a protected resource is denied.

It sets the response status to `403 FORBIDDEN` and returns the error as JSON.

The error message is retrieved from `MessageSource` using the current request's locale.

If the exception contains a message that matches a translation key, that key is used instead. Otherwise, the default `error.accessDenied` message is returned.

`ErrorDto` is used to format the error response, while `ObjectMapper` converts it to JSON.


---

## *JwtAuthFilter.java*

`JwtAuthFilter` is a Spring Security filter responsible for validating JWT authentication tokens in incoming HTTP requests.

It extends `OncePerRequestFilter`, ensuring that the filter is executed once per request.

It contains :

* `doFilterInternal()`,
* `sendErrorResponse()`,
* `getMessage()`,
* `userAuthenticationProvider`,
* `messageSource`

### `doFilterInternal()`

Processes each incoming request and checks its `Authorization` header.

If the header contains a `Bearer` token, it uses `UserAuthenticationProvider` to validate the JWT and set the authenticated user in Spring Security's `SecurityContext`.

If the token is invalid, expired, malformed, or has an invalid signature or type, the security context is cleared and an HTTP `401 UNAUTHORIZED` response is returned.

If the `Authorization` header is malformed, an error response is also returned.

If no authentication error occurs, the request continues through the filter chain.

### Error handling

Different JWT errors are handled separately so that the application can return the corresponding translated error message.

`MessageSource` is used with the current locale to retrieve these messages.

### `sendErrorResponse()`

Creates a JSON error response containing the error `message`.

It sets the HTTP status to `401 UNAUTHORIZED` and uses `ObjectMapper` to convert the response to JSON.

### `getMessage()`

Retrieves a translated message from `MessageSource` using a message key and the current request locale.


---

## *PermissionEnum.java*

`PermissionEnum` is an enumeration that defines the permissions available in the application.

Each permission represents an action that can be performed on users or items.

It contains :

* `USER_READ`,
* `USER_WRITE`,
* `USER_UPDATE`,
* `USER_DELETE`,
* `ITEM_READ`,
* `ITEM_WRITE`,
* `ITEM_UPDATE`,
* `ITEM_DELETE`

Each enum value has a corresponding permission string, such as `user:read` or `item:update`.

The `getPermission()` method returns this string so it can be used by Spring Security for authorization checks.

These permissions are used together with user roles to control access to different operations in the application.


---

## *Role.java*

`Role` is a JPA Entity class that represents a role in the database.

It stores information about the role, including its name, description, timestamps, and the users assigned to it.

It contains :

* `id`,
* `name`,
* `description`,
* `createdAt`,
* `updatedAt`,
* `usersMains`,
* `usersAppSpecifique`

The `name` field uses `RoleEnum` to define the available role types and is stored as a string in the database.

`usersMains` represents the users who have this role as their main role through a one-to-many relationship.

`usersAppSpecifique` represents users who have this role as an application-specific role through a many-to-many relationship.

Both user collections use `@JsonIgnore` to prevent the users from being included when the role is converted to JSON.

`createdAt` and `updatedAt` are automatically managed by Hibernate to track when the role was created and last modified.

`@Getter` and `@Setter` from Lombok automatically generate the getters and setters for the class.


---

## *MainRoleEnum.java* and *LocalRoleEnum.java*

Roles come in two kinds, each with its own enumeration.

`MainRoleEnum` mirrors the **main roles** owned by the `spring-auth` application (`USER`, `MANAGER`, `ADMIN`). The global permissions of these roles (e.g. `user:read`) are granted by `spring-auth` and arrive in the JWT `permissions` claim, so they are **not** repeated here. Each main role only lists the **local** permissions this application adds on top of them:

* `USER` → can read items.
* `MANAGER` → can read, create, and update items.
* `ADMIN` → has all item permissions, including deletion.

`LocalRoleEnum` defines the **local roles** (e.g. `LOCAL_MANAGER`), which exist only in this application, are persisted in the `roles` table and are never transmitted from the `spring-auth` application.

The `getPermissions()` method returns the local permissions associated with a role.

The `getGrantedAuthorities()` method converts these permissions into Spring Security `SimpleGrantedAuthority` objects and also adds the role itself as a `ROLE_*` authority.

These authorities are used by Spring Security to control access to protected endpoints.


---

## *RoleRepository.java*

`RoleRepository` is a repository interface used to access and manage `Role` entities in the database.

It extends `CrudRepository<Role, Long>`, which provides basic CRUD operations such as creating, finding, updating, and deleting roles.

It contains :

* `findByName()`

### `findByName()`

Finds a role using its `RoleEnum` name.

It returns an `Optional<Role>`, which means the role may or may not exist in the database.

Spring Data JPA automatically creates the implementation of this repository and generates the query based on the method name.


---

## *RoleSeeder.java*

`RoleSeeder` is a seeder class used to initialize the database with the application's default roles.

It implements `ApplicationListener<ContextRefreshedEvent>`, so the roles are checked and created when the Spring application context is refreshed.

It contains :

* `roleRepository`,
* `onApplicationEvent()`,
* `loadRoles()`

### `loadRoles()`

Checks whether the default roles already exist in the database.

It creates the following roles if they do not exist :

* `USER` → default user role,
* `MANAGER` → manager role,
* `ADMIN` → administrator role,
* `LOCAL_MANAGER` → role specific to the application.

Each newly created role is given its corresponding `RoleEnum` value and description before being saved using `RoleRepository`.

If a role already exists, it is not created again.


---

## *SecurityConfig.java*

`SecurityConfig` is the main Spring Security configuration class for the application.

It configures authentication, authorization, JWT authentication, CORS, sessions, and security error handling.

It contains :

* `securityFilterChain()`,
* `userAuthenticationEntryPoint`,
* `accessDeniedHandler`,
* `jwtAuthFilter`

### `securityFilterChain()`

Configures the application's Spring Security filter chain.

It adds `JwtAuthFilter` before Spring Security's `BasicAuthenticationFilter` so that JWT tokens are validated before protected requests are processed.

CSRF protection is disabled because the application uses a stateless API for its authentication requests.

The session policy is set to `ALWAYS` because the OAuth2 login flow uses the HTTP session to store authentication information.

### CORS

The configuration allows requests from :

* `http://localhost:3000`,
* `http://localhost:4000`,
* `http://localhost:8080`

It allows `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS` requests, accepts all headers, and allows credentials.

### Authorization

The following endpoints are accessible without authentication :

* `/error`,
* `POST /auth/login`,
* `POST /auth/register`,
* `POST /auth/refresh`,
* `GET /auth/login/azure`,
* `GET /auth/auth-code`,
* `GET /auth/tokens`,
* all `OPTIONS` requests.

All other requests require the user to be authenticated.

### Error handling

`UserAuthenticationEntryPoint` handles unauthenticated requests, while `CustomAccessDeniedHandler` handles requests where an authenticated user does not have sufficient permissions.

`@EnableMethodSecurity` also enables annotations such as `@PreAuthorize` on controllers and services.


---

## *SecurityExceptions.java*

`SecurityExceptions` is a container class for security-related exceptions.

This class groups all security-specific exceptions as static inner classes.

It contains :

* `InvalidTokenException`,
* `InvalidRefreshTokenException`,
* `JwtVerificationException`,
* `JwtTokenExpiredException`,
* `InvalidJwtSignatureException`,
* `MalformedJwtException`,
* `InvalidTokenTypeException`,
* `AuthenticationRequiredException`,
* `MissingAuthorizationHeaderException`,
* `InvalidAuthorizationHeaderException`,
* `AccessDeniedException`,
* `InsufficientRoleException`,
* `InsufficientPermissionException`,
* `InvalidSecurityContextException`,
* `TokenCreationException`,
* `SecurityConfigurationException`,
* `CorsViolationException`,
* `InvalidSessionException`,
* `AuthenticationProviderException`

Each exception extends `AppException` and implements `MessageKeyProvider`, allowing it to define an HTTP status and a localized message key.

### Token exceptions

`InvalidTokenException` and `InvalidRefreshTokenException` handle invalid or expired authentication and refresh tokens.

`JwtVerificationException`, `JwtTokenExpiredException`, `InvalidJwtSignatureException`, `MalformedJwtException`, and `InvalidTokenTypeException` handle different JWT validation errors.

### Authorization exceptions

`AccessDeniedException` is used when access to a resource is denied.

`InsufficientRoleException` and `InsufficientPermissionException` are used when a user does not have the required role or permission.

These exceptions can provide the required role or permission as a message argument.

### Authentication and configuration exceptions

`AuthenticationRequiredException` and the authorization header exceptions handle missing or invalid authentication information.

`InvalidSecurityContextException` handles an invalid security context.

`TokenCreationException`, `SecurityConfigurationException`, and `AuthenticationProviderException` handle errors related to token creation, security configuration, and the authentication provider.

`CorsViolationException` handles CORS-related security violations, while `InvalidSessionException` handles invalid or expired sessions.

The exceptions use HTTP statuses such as `401 UNAUTHORIZED`, `403 FORBIDDEN`, `400 BAD_REQUEST`, and `500 INTERNAL_SERVER_ERROR` depending on the type of error.


---

## *UserAuthenticationEntryPoint.java*

`UserAuthenticationEntryPoint` is a Spring Security component used to handle requests from unauthenticated users.

It implements `AuthenticationEntryPoint` and returns a JSON response with HTTP status `401 UNAUTHORIZED`.

It contains :

* `commence()`,
* `getMessage()`,
* `messageSource`,
* `OBJECT_MAPPER`

### `commence()`

Handles authentication failures when an unauthenticated user tries to access a protected resource.

It sets the response status to `401 UNAUTHORIZED` and the content type to JSON.

The error message is retrieved from `MessageSource` using the current locale.

If the authentication exception contains a message that matches a translation key, that message is used. Otherwise, the default `security.auth.missingOrInvalidToken` message is returned.

The error is returned using `ErrorDto` and `ObjectMapper`.

### `getMessage()`

Retrieves a translated message from `MessageSource` using a message key and the current request locale.


---

## *UserAuthenticationProvider.java*

`UserAuthenticationProvider` is a Spring Security component responsible for creating and validating JWT authentication tokens.

It uses `UserService` to retrieve or create users and to synchronize their roles with the information contained in the token.

It contains :

* `init()`,
* `createToken()`,
* `buildAuthorities()`,
* `validateToken()`

### `init()`

Encodes the JWT secret key after dependency injection.

The secret key is provided through the `SECURITY_JWT_TOKEN_SECRET_KEY` configuration property.

### `createToken()`

Creates a JWT token containing information about the user.

The token contains :

* user login,
* first name,
* last name,
* main role,
* application-specific roles,
* issue time,
* expiration time.

The token is valid for **1 hour** and is signed using the configured secret key.

### Authorities

The authorities of an authenticated user are the union of:

* the global permissions granted by `spring-auth` in the token `permissions` claim,
* the local permissions of the user's main role (`MainRoleEnum.getGrantedAuthorities()`),
* the permissions of the user's app-specific roles (`LocalRoleEnum.getGrantedAuthorities()`).

### `validateToken()`

Validates a JWT token by checking its signature and expiration.

It also checks the token type when the `typ` claim is present.

After validation, the user information is extracted from the token and converted into a `UserDto`.

`UserService` is then used to retrieve or create the local user and update their main role.

The user's roles are converted into Spring Security authorities before creating the `Authentication` object.

### Error handling

Different JWT validation errors are converted into the corresponding `SecurityExceptions`:

* expired token → `JwtTokenExpiredException`,
* invalid signature → `InvalidJwtSignatureException`,
* verification failure → `JwtVerificationException`,
* malformed token → `MalformedJwtException`,
* invalid token type → `InvalidTokenTypeException`,
* other token errors → `InvalidTokenException`.


---

## *WebClientConfig.java*

`WebClientConfig` is a configuration class used to configure a Spring `WebClient`.

It contains :

* `webClient()`

### `webClient()`

Creates and provides a `WebClient` bean that can be injected into other components of the application.

The `WebClient` is configured with the base URL `http://host.docker.internal:8080`, which is used as the default address for outgoing HTTP requests.

This `WebClient` can be used by services such as `AuthClient` to communicate with external APIs.


---

## *WebConfig.java*

`WebConfig` is a configuration class used to configure web-related settings for the application.

It configures CORS and registers a CORS filter that runs before the Spring Security filters.

It contains :

* `corsFilter()`,
* `MAX_AGE`,
* `CORS_FILTER_ORDER`

### `corsFilter()`

Creates and configures the application's CORS filter.

It allows requests from :

* `http://localhost:8080`,
* `http://localhost:3000`,
* `http://localhost:4000`

It allows the following HTTP methods :

* `GET`,
* `POST`,
* `PUT`,
* `DELETE`

It also allows the `Authorization`, `Content-Type`, and `Accept` headers and supports credentials.

The CORS preflight response is cached for **3600 seconds**.

The filter is registered with order `-102` so that it runs before the Spring Security filter chain.

`@EnableWebMvc` enables Spring MVC configuration for the application.
