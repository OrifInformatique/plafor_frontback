# TEST PACKAGE

## Table of Contents
- [TestController.java](#testcontrollerjava)
    - [Endpoints](#endpoints)
    - [Security](#security)

## *TestController.java*

`TestController` is a REST Controller containing test endpoints used to verify the application's functionality and configuration.

It uses `UserService` to perform user-related operations and `MessageSource` to return translated messages.

All endpoints use the `/tests` path.

It contains :

* `getHello()`,
* `authenticatedUser()`,
* `promoteToTestAdmin()`,
* `allUsers()`

### Endpoints

* `GET /tests/` → checks that the application is running and displays information such as the Java environment, active Spring profile, and database URL.
* `GET /tests/me` → retrieves information about the currently authenticated user.
* `PUT /tests/{userLogin}/promote-test` → promotes a user to the local application role. Requires the `user:update` permission.
* `GET /tests/all` → retrieves all users. Requires the `user:read` permission.

### Security

The controller uses `@PreAuthorize` to restrict access to its endpoints.

The `/tests/` and `/tests/me` endpoints require the user to be authenticated.

The promotion endpoint requires `user:update`, while the endpoint retrieving all users requires `user:read`.

The controller also uses `SecurityContextHolder` to retrieve the currently authenticated user and `MessageSource` to return localized success messages.


---