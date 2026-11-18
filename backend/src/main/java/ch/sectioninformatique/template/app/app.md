# APP PACKAGE

## Table of Contents
- [Errors](#errors)
    - [ErrorDto.java](#errordtojava)
- [Exceptions](#exceptions)
    - [AppException.java](#appexceptionjava)
    - [AppMessageKeyException.java](#appmessagekeyexceptionjava)
    - [GlobalExceptionHandler.java](#globalexceptionhandlerjava)
        - [handleAppException()](#handleappexception)
        - [handleAccessDenied()](#handleaccessdenied)
        - [handleValidationErrors()](#handlevalidationerrors)
        - [handleUnsupportedMediaType()](#handleunsupportedmediatype)
        - [handleMissingParams()](#handlemissingparams)
        - [handleMalformedJson()](#handlemalformedjson)
        - [Error Response](#error-response)
    - [MessageKeyProvider.java](#messagekeyproviderjava)
        - [getMessageKey()](#getmessagekey)
        - [getMessageArgs()](#getmessageargs)
        - [NO_ARGS](#no_args)

## *Errors*
### ErrorDto.java

`ErrorDto` is a Data Transfer Object used to represent error responses in the REST API.

It provides a standardized structure for returning error messages.

It contains :

* `message`

The `message` field contains a description of what went wrong.

Because `ErrorDto` is a Java `record`, it is immutable and automatically provides its constructor, getter, `equals()`, `hashCode()`, and `toString()` methods.

---
## *Exceptions*
### AppException.java

`AppException` is the base exception class used for application-specific errors.

It extends `RuntimeException` and stores the HTTP status that should be returned when the exception is handled by the API.

It contains :

* `status`

The `status` field contains the HTTP status associated with the error.

The `getStatus()` method returns this status so it can be used when creating the HTTP response.

Other application exceptions can extend `AppException` to provide a specific HTTP status for their errors.

---

### AppMessageKeyException.java

`AppMessageKeyException` is a generic application exception used when an error needs a specific message key and optional arguments.

It extends `AppException` and implements `MessageKeyProvider`.

It contains :

* `messageKey`,
* `messageArgs`

The `messageKey` identifies the translated error message that should be displayed.

The `messageArgs` contains optional values used to format the translated message.

The `getMessageKey()` and `getMessageArgs()` methods provide the message key and its arguments to the error handling system.

The exception also inherits the HTTP status from `AppException`.


---

### GlobalExceptionHandler.java

`GlobalExceptionHandler` is a centralized exception handler for the application.

It uses `@ControllerAdvice` to catch exceptions from all controllers and return consistent error responses.

It contains :

* `handleAppException()`,
* `handleAccessDenied()`,
* `handleValidationErrors()`,
* `handleUnsupportedMediaType()`,
* `handleMissingParams()`,
* `handleMalformedJson()`

It also uses `MessageSource` to translate error messages according to the current locale.

### `handleAppException()`

Handles custom `AppException` errors.

If the exception implements `MessageKeyProvider`, its message key and arguments are used to retrieve the translated error message.

Otherwise, a generic `error.unexpected` message is returned.

### `handleAccessDenied()`

Handles `AccessDeniedException` when a user does not have permission to perform an action.

It returns HTTP `403 FORBIDDEN` with a translated error message.

### `handleValidationErrors()`

Handles validation errors caused by `@Valid`.

It collects all field validation errors and returns them in a `fieldErrors` map.

It returns HTTP `400 BAD_REQUEST`.

### `handleUnsupportedMediaType()`

Handles requests using an unsupported media type, such as an unsupported `Content-Type`.

It returns HTTP `415 UNSUPPORTED_MEDIA_TYPE`.

### `handleMissingParams()`

Handles requests where a required request parameter is missing.

It returns HTTP `400 BAD_REQUEST`.

### `handleMalformedJson()`

Handles requests where the request body cannot be read or parsed, such as invalid JSON or incorrect data types.

It returns HTTP `400 BAD_REQUEST`.

### Error response

The `errorResponse()` method creates a common response format containing :

* `timestamp`,
* `status`,
* `error`,
* `message`

This ensures that errors returned by the API follow a consistent structure.


---

### MessageKeyProvider.java

`MessageKeyProvider` is an interface used by exceptions to provide a message key and optional arguments for localized error messages.

It allows the global exception handler to retrieve the correct translated message.

It contains :

* `getMessageKey()`,
* `getMessageArgs()`,
* `NO_ARGS`

### `getMessageKey()`

Returns the key used to find the corresponding translated message in the application's message files.

### `getMessageArgs()`

Returns optional arguments used to format the translated message.

By default, it returns an empty array through `NO_ARGS`.

### `NO_ARGS`

A shared empty `Object` array used when an exception does not require any message arguments.

Classes implementing `MessageKeyProvider` can override `getMessageArgs()` when their translated message requires additional values.


---