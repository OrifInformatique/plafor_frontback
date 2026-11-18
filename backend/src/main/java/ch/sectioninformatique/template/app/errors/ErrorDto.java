package ch.sectioninformatique.template.app.errors;

/**
 * Data Transfer Object (DTO) for error responses.
 * This record:
 * - Represents a standardized error message format
 * - Is used in REST API error responses
 * - Provides a consistent structure for error messages
 * - Is immutable by design (using record)
 *
 * @param message The error message describing what went wrong
 */
public record ErrorDto (String message) { }
