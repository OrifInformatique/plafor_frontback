package ch.sectioninformatique.template.auth;

/**
 * Data transfer object for user credentials.
 * This record class holds the login and password information used for user authentication.
 *
 * @param login The user's login identifier
 * @param password The user's password as a character array
 */
public record CredentialsDto (String login, char[] password) { }
