package ch.sectioninformatique.template.auth;

import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object (DTO) representing a password update input from the client.
 * 
 * This DTO encapsulates the old and new passwords as char arrays for security reasons:
 * - Using `char[]` instead of `String` reduces the risk of passwords lingering
 *   in immutable memory (String pool), which can be accessed in memory dumps.
 * 
 * Validation:
 * - `@NotNull` ensures that passwords are provided in the request body.
 */
public record PasswordUpdateDto (@NotNull char[] oldPassword, @NotNull char[] newPassword) {}