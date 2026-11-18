package ch.sectioninformatique.template.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Data Transfer Object (DTO) representing a response containing an access token.
 * 
 * This DTO is typically returned after successful authentication or
 * when a refresh token is used to obtain a new access token.
 * 
 * Example usage:
 * 
 * {
 *     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 *
 * Security considerations:
 * 
 *     The access token should be short-lived and used only for API authentication.
 *     Access tokens should never be stored in insecure locations such as local storage in a browser.
 * 
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenResponseDto {
    private String accessToken;
}
