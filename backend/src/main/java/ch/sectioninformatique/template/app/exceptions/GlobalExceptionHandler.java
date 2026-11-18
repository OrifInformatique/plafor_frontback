package ch.sectioninformatique.template.app.exceptions;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * GlobalExceptionHandler is a centralized exception handling component for the
 * application.
 * 
 * This class uses Spring's @ControllerAdvice annotation to intercept exceptions
 * thrown
 * across the entire application and provide consistent, formatted error
 * responses to clients.
 * 
 * Benefits:
 * - Centralizes exception handling logic (DRY principle)
 * - Ensures consistent error response format across all endpoints
 * - Reduces boilerplate try-catch blocks in controllers
 * - Provides detailed error information for debugging
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final String VALIDATION_FAILED_MESSAGE_KEY = "error.validation.failed";

    private final MessageSource messageSource;

    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    private String msg(String key, Object... args) {
        // Fall back to the key itself when no bundle entry is found.
        return messageSource.getMessage(key, args, key, LocaleContextHolder.getLocale());
    }

    /**
     * Builds a standardized error response entity.
     * 
     * This helper method creates a consistent response format for all exceptions,
     * including timestamp, HTTP status code, error type, and detailed message.
     * 
     * @param status  The HTTP status code to return
     * @param message The error message to display to the client
     * @return ResponseEntity containing the formatted error response
     */
    private Map<String, Object> errorResponse(HttpStatus status, String message) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message);
    }

    private ResponseEntity<Object> buildResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(errorResponse(status, message));
    }

    // ========================================================================
    // Custom Application Exceptions
    // ========================================================================

    /**
     * Handles AppException - the custom application exception.
     *
     * Resolves the exception's message via MessageKeyProvider when available,
     * otherwise returns a generic unexpected error message.
     *
     * @param ex The AppException instance
     * @return ResponseEntity with the exception's status and resolved message
     */
    @ExceptionHandler(AppException.class)
    public ResponseEntity<Object> handleAppException(AppException ex) {
        if (ex instanceof MessageKeyProvider) {
            MessageKeyProvider provider = (MessageKeyProvider) ex;
            return buildResponse(ex.getStatus(), msg(provider.getMessageKey(), provider.getMessageArgs()));
        }

        return buildResponse(ex.getStatus(), msg("error.unexpected"));
    }

    // ========================================================================
    // Spring Framework Built-in Exceptions
    // ========================================================================

    /**
     * Handles AccessDeniedException - thrown when user lacks permission for an
     * action.
     * 
     * Returns HTTP 403 Forbidden with a user-friendly message indicating
     * that the user doesn't have permission to access the requested resource.
     * 
     * @param ex The AccessDeniedException thrown by Spring Security
     * @return ResponseEntity with HTTP 403 and permission denied message
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, msg("error.accessDenied"));
    }

    /**
     * Handles MethodArgumentNotValidException - thrown when @Valid validation
     * fails.
     * 
     * Collects ALL validation errors (not just the first one) and returns them
     * in two formats:
     * 1. A combined message for backward compatibility
     * 2. A detailed fieldErrors map for granular client-side handling
     * 
     * Example response:
     * {
     * "message": "email: Invalid email format; age: Must be between 18 and 120",
     * "fieldErrors": {
     * "email": "Invalid email format",
     * "age": "Must be between 18 and 120"
     * }
     * }
     * 
     * @param ex The MethodArgumentNotValidException from Spring validation
     * @return ResponseEntity with HTTP 400 and all validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                this::resolveValidationFieldError,
                (existing, replacement) -> replacement));

        String genericMessage = msg(VALIDATION_FAILED_MESSAGE_KEY);

        Map<String, Object> response = new LinkedHashMap<>(
            errorResponse(HttpStatus.BAD_REQUEST, genericMessage));
        response.put("fieldErrors", fieldErrors);

        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handles HttpMediaTypeNotSupportedException - thrown when client sends
     * unsupported media type.
     * 
     * Occurs when request Content-Type is not supported by the endpoint
     * (e.g., sending XML when endpoint expects JSON).
     * 
     * @param ex The HttpMediaTypeNotSupportedException from Spring
     * @return ResponseEntity with HTTP 415 and unsupported media type message
     */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Object> handleUnsupportedMediaType(HttpMediaTypeNotSupportedException ex) {
        return buildResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE, ex.getMessage());
    }

    /**
     * Handles MissingServletRequestParameterException - thrown when required
     * request parameter is missing.
     * 
     * Occurs when an endpoint requires a query parameter or form parameter that
     * wasn't provided.
     * 
     * Example: GET /api/search without required 'query' parameter
     * 
     * @param ex The MissingServletRequestParameterException from Spring
     * @return ResponseEntity with HTTP 400 and parameter name in error message
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Object> handleMissingParams(MissingServletRequestParameterException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    /**
     * Handles MethodArgumentTypeMismatchException - thrown when a request
     * parameter cannot be converted to the expected type.
     *
     * Occurs, for instance, when an enum-typed query parameter receives a value
     * that matches no constant (e.g. {@code GET /users?state=foo}). The
     * underlying cause's message carries the accepted values.
     *
     * @param ex The MethodArgumentTypeMismatchException from Spring
     * @return ResponseEntity with HTTP 400 and the parameter name in the message
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String reason = ex.getMostSpecificCause().getMessage();
        return buildResponse(HttpStatus.BAD_REQUEST,
            msg("error.parameter.invalid", ex.getName(), ex.getValue(), reason));
    }

    /**
     * Handles HttpMessageNotReadableException - thrown when request body cannot be
     * parsed.
     * 
     * This typically occurs with malformed JSON, missing required fields, or type
     * mismatches.
     * This handler attempts to provide specific, actionable error messages based on
     * the
     * underlying parsing error, making debugging easier for clients.
     * 
     * Examples of specific messages:
     * - "JSON is incomplete - missing closing bracket or quote"
     * - "JSON contains invalid character - check for unescaped quotes or missing
     * commas"
     * - "Invalid value type for a field - check your data types match the schema"
     * - "Empty or missing request body"
     * 
     * @param ex The HttpMessageNotReadableException from Spring
     * @return ResponseEntity with HTTP 400 and specific parsing error guidance
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleMalformedJson(HttpMessageNotReadableException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    private String resolveValidationFieldError(FieldError error) {
        String defaultMessage = error.getDefaultMessage();
        return defaultMessage != null ? defaultMessage : error.getField();
    }
}
