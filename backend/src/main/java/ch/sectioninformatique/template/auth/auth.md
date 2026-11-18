# AUTH PACKAGE

## Table of Contents
- [AuthClient.java](#authclientjava)
- [AuthCodeDto.java](#authcodedtojava)
- [AuthController.java](#authcontrollerjava)
    - [getToken()](#gettoken)
    - [Security](#security)
- [AuthExceptions.java](#authexceptionsjava)
    - [InvalidCredentialsException](#invalidcredentialsexception)
    - [RegistrationFailedException](#registrationfailedexception)
    - [UserNotFoundException](#usernotfoundexception)
    - [UserAlreadyExistsException](#useralreadyexistsexception)
    - [PasswordUpdateFailedException](#passwordupdatefailedexception)
    - [OAuth2AuthenticationException](#oauth2authenticationexception)
    - [LoginAlreadyExistsException](#loginalreadyexistsexception)
    - [AuthCodeNotFoundException](#authcodenotfoundexception)
- [CredentialsDto.java](#credentialsdtojava)
- [MessageResponseDto.java](#messageresponsedtojava)
- [PasswordUpdateDto.java](#passwordupdatedtojava)
- [RefreshUpdateDto.java](#refreshupdatedtojava)
- [RegisterDto.java](#registerdtojava)
- [TokenResponseDto.java](#tokenresponsedtojava)

## *AuthClient.java*

`AuthClient` is a service class used to communicate with the external `spring-auth` authentication service.

It uses Spring's `WebClient` to send asynchronous HTTP requests for authentication, user management, and role management.

It contains :

* `login()`,
* `register()`,
* `refreshLogin()`,
* `updatePassword()`,
* `logout()`,
* `deleteGlobalUser()`,
* `deleteGlobalUserPermanent()`,
* `promoteToManager()`,
* `revokeManager()`,
* `promoteToAdmin()`,
* `revokeAdmin()`,
* `downgradeAdmin()`,
* `getTokenWithAuthCode()`

### Authentication

`login()` sends the user's credentials to the authentication service and returns the authenticated user's information.

`register()` creates a new user through the authentication service.

`refreshLogin()` uses the `refresh_token` cookie to request a new access token.

`getTokenWithAuthCode()` exchanges a temporary authentication code for the user's authentication information and tokens.

`updatePassword()` sends the user's password update request to the authentication service.

`logout()` logs the user out and forwards the expired `refresh_token` cookie.

### User management

`deleteGlobalUser()` performs a soft deletion of a user in the authentication service.

`deleteGlobalUserPermanent()` permanently deletes a user.

Both methods send the user's authentication token and convert authentication-service errors into application exceptions.

### Role management

The class provides methods to modify user roles :

* `promoteToManager()` → promotes a user to manager,
* `revokeManager()` → removes the manager role,
* `promoteToAdmin()` → promotes a user to administrator,
* `revokeAdmin()` → removes the administrator role,
* `downgradeAdmin()` → changes an administrator back to manager.

Errors returned by the authentication service are converted into `AppMessageKeyException` so they can be handled and localized by `GlobalExceptionHandler`.

### Language handling

The `uriWithOptionalLang()` method adds the current `lang` query parameter to requests sent to the authentication service.

This allows the external authentication service to return messages in the same language as the current request.

### Configuration

The authentication service URL is provided through the `SPRING_AUTH_URL` environment variable.

The Azure login and OAuth2 callback URLs are provided through :

* `AZURE_LOGIN_URL`,
* `AFTER_OAUTH2_LOGIN_URL`.

`AuthClient` therefore acts as the connection between `template_frontback` and the external authentication service, handling authentication requests, user management, role changes, cookies, and localized errors.


---

## *AuthCodeDto.java*

`AuthCodeDto` is a Data Transfer Object used to transfer a temporary authentication code.

It contains :

* `id`,
* `code`

The `id` identifies the user or authentication request associated with the code.

The `code` contains the temporary authentication code used during the authentication process.

`@Builder` from Lombok provides a builder for creating `AuthCodeDto` objects.

Because `AuthCodeDto` is a Java `record`, it is immutable and automatically provides its constructor, accessors, `equals()`, `hashCode()`, and `toString()` methods.


---

## *AuthController.java*

`AuthController` is a REST Controller responsible for handling authentication and user account operations.

It uses `AuthClient` to communicate with the external authentication service and `UserService` to manage users in the local database.

All endpoints use the `/auth` path.

It contains :

* `login()`,
* `register()`,
* `refreshLogin()`,
* `updatePassword()`,
* `OAuth2AzureLogin()`,
* `authCode()`,
* `getToken()`,
* `logout()`

### Authentication

`login()` sends the user's credentials to the authentication service and returns the authentication result.

`register()` creates a new account through the authentication service and also registers the user in the local database.

`refreshLogin()` uses the `refresh_token` cookie to request a new access token.

`updatePassword()` sends the user's password update request to the authentication service.

`logout()` invalidates the current session, clears the Spring Security context, and sends the logout request to the authentication service.

### Azure OAuth2 login

`OAuth2AzureLogin()` starts the Azure OAuth2 login process.

It stores the frontend redirect URL in the HTTP session and creates a `redirect_url` cookie before redirecting the user to the authentication service.

`authCode()` handles the authorization code returned after a successful Azure login.

It exchanges the code for authentication tokens, gets or creates the user in the local database, stores the user and refresh token in the session, and redirects the user to the frontend.

### `getToken()`

Retrieves the logged-in user's information from the HTTP session.

It also recreates the `refresh_token` cookie with its configured lifetime and returns the stored user information.

If the required session information is missing, it returns HTTP `401 UNAUTHORIZED`.

### Security

The `register()` endpoint requires the `user:write` permission.

The controller also uses the user's HTTP session to store authentication information during the OAuth2 login process.

Overall, `AuthController` provides the application's authentication endpoints while delegating the actual communication with the external authentication service to `AuthClient`.


---

## *AuthExceptions.java*

`AuthExceptions` is a container class for authentication-related exceptions.

This class groups all authentication exceptions as static inner classes.

It contains :

* `InvalidCredentialsException`,
* `RegistrationFailedException`,
* `UserNotFoundException`,
* `UserAlreadyExistsException`,
* `PasswordUpdateFailedException`,
* `OAuth2AuthenticationException`,
* `LoginAlreadyExistsException`,
* `AuthCodeNotFoundException`

Each exception extends `AppException` and implements `MessageKeyProvider`, allowing it to define an HTTP status and a localized message key.

### `InvalidCredentialsException`

Thrown when the provided login credentials are invalid.

It uses HTTP status `401 UNAUTHORIZED` and the message key `auth.invalidCredentials`.

### `RegistrationFailedException`

Thrown when user registration fails.

It uses HTTP status `400 BAD_REQUEST` and the message key `auth.register.failed`.

It also stores the error details as message arguments.

### `UserNotFoundException`

Thrown when a user cannot be found during authentication.

It uses HTTP status `404 NOT_FOUND` and the message key `user.notFound`.

### `UserAlreadyExistsException`

Thrown when trying to create a user that already exists.

It uses HTTP status `409 CONFLICT` and the message key `auth.userAlreadyExists`.

### `PasswordUpdateFailedException`

Thrown when updating a user's password fails.

It uses HTTP status `400 BAD_REQUEST` and the message key `auth.password.update.failed`.

### `OAuth2AuthenticationException`

Thrown when an OAuth2 authentication process fails.

It uses HTTP status `401 UNAUTHORIZED` and the message key `auth.oauth2.failed`.

### `LoginAlreadyExistsException`

Thrown when a login is already taken during registration.

It uses HTTP status `400 BAD_REQUEST` and the message key `auth.loginAlreadyExists`.

### `AuthCodeNotFoundException`

Thrown when an OAuth2 authentication code cannot be found.

It uses HTTP status `404 NOT_FOUND` and the message key `auth.code.not.found`.


---

## *CredentialsDto.java*

`CredentialsDto` is a Data Transfer Object used to transfer the user's login credentials during authentication.

It contains :

* `login`,
* `password`

The `login` contains the user's login identifier.

The `password` contains the user's password as a character array.

Because `CredentialsDto` is a Java `record`, it is immutable and automatically provides its constructor, accessors, `equals()`, `hashCode()`, and `toString()` methods.


---

## *MessageResponseDto.java*

`MessageResponseDto` is a Data Transfer Object used to return a simple message in an API response.

It contains :

* `message`

The `message` field contains the text returned to the client.

Because `MessageResponseDto` is a Java `record`, it is immutable and automatically provides its constructor, accessor, `equals()`, `hashCode()`, and `toString()` methods.


---

## *PasswordUpdateDto.java*

`PasswordUpdateDto` is a Data Transfer Object used to transfer the information needed to update a user's password.

It contains :

* `oldPassword`,
* `newPassword`

Both passwords are stored as character arrays (`char[]`) instead of `String`.

`@NotNull` ensures that both the old and new passwords are provided in the request.

The old password is used to verify the user's current password before changing it, while the new password is used as the replacement password.

---

## *RefreshUpdateDto.java*

`RefreshRequestDto` is a Data Transfer Object used to transfer a refresh token when requesting a new access token.

It contains :

* `refreshToken`

The `refreshToken` contains the token provided by the authentication system.

Because `RefreshRequestDto` is a Java `record`, it is immutable and automatically provides its constructor, accessor, `equals()`, `hashCode()`, and `toString()` methods.


---

## *RegisterDto.java*

`RegisterDto` is a Data Transfer Object used to transfer the information required to create a new user account.

It contains :

* `firstName`,
* `lastName`,
* `login`,
* `password`

The `firstName` and `lastName` contain the user's name information.

The `login` contains the user's login identifier.

The `password` contains the user's password as a character array.

Because `RegisterDto` is a Java `record`, it is immutable and automatically provides its constructor, accessors, `equals()`, `hashCode()`, and `toString()` methods.


---

## *TokenResponseDto.java*

`TokenResponseDto` is a Data Transfer Object used to return an access token after successful authentication or token refresh.

It contains :

* `accessToken`

The `accessToken` contains the token used by the client to authenticate API requests.

`@Data` from Lombok automatically generates getters, setters, `toString()`, `equals()`, and `hashCode()`.

`@AllArgsConstructor` generates a constructor containing all fields, while `@NoArgsConstructor` generates an empty constructor.


---