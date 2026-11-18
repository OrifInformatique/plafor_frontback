package ch.sectioninformatique.template.auth;

import java.util.List;

/**
 * Data transfer object for user registration.
 * This record class holds the information required to create a new user
 * account.
 *
 * @param firstName         The user's first name
 * @param lastName          The user's last name
 * @param login             The user's login identifier
 * @param password          The user's password as a character array
 * @param mainRole          The user's main role
 * @param appSpecificRoles  The user's appSpecificRoles
 */
public record RegisterDto(String firstName, String lastName, String login, char[] password, String mainRole , List<String> appSpecificRoles ) {}
