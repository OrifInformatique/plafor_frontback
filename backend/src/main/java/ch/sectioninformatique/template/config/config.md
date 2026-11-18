# CONFIG PACKAGE

## Table of Contents
- [LocaleConfig.java](#localeconfigjava)
    - [messageSource()](#messagesource)
    - [localeResolver()](#localeresolver)
    - [validator()](#validator)
    - [addInterceptors()](#addinterceptors)

## *LocaleConfig.java*

`LocaleConfig` is a configuration class responsible for managing the application's language and internationalization settings.

It configures the message sources, locale resolution, validation messages, and the `lang` request parameter.

It contains :

* `messageSource()`,
* `localeResolver()`,
* `validator()`,
* `addInterceptors()`

### `messageSource()`

Configures the `MessageSource` used to load translated messages from `.properties` files.

It searches for message files inside the `messages` directory and automatically detects the available message bundles.

The default encoding is `UTF-8`, and messages are cached for **3600 seconds**.

### `localeResolver()`

Determines which language should be used for a request.

It first checks if a locale was specified using the `lang` parameter. If not, it uses the browser's `Accept-Language` header.

The default locale is French (`Locale.FRANCE`).

### `validator()`

Configures Spring's validation system to use the application's `MessageSource`.

This allows validation error messages to be translated according to the current locale.

### `addInterceptors()`

Adds an HTTP interceptor that checks for the `lang` query parameter before each request.

If `lang` is provided, the corresponding locale is applied to the current request.

After the request is completed, the locale context is reset to avoid affecting other requests.

Overall, `LocaleConfig` allows the application to support multiple languages and use the correct translated messages for each request.
