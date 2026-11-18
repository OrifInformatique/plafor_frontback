package ch.sectioninformatique.template.auth;

/**
 * Data Transfer Object (DTO) representing a refresh token request.
 * 
 * This DTO is used when a client wants to obtain a new access token
 * by providing a valid refresh token.
 * 
 * Example usage:
 * 
 * POST /auth/refresh
 * {
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 *
 * Security considerations:
 * 
 *     The refresh token should be a secure JWT issued by the authentication system.
 *     Refresh tokens should be stored securely on the client side, preferably in an HTTP-only cookie.
 *
 * @param refreshToken The refresh token string provided by the client to obtain a new access token.
 */
public record RefreshRequestDto(String refreshToken) {}
