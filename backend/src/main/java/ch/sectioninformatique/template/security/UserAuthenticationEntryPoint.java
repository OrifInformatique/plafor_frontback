package ch.sectioninformatique.template.security;

import java.io.IOException;

import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import ch.sectioninformatique.template.app.errors.ErrorDto;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

/**
 * Entry point for handling unauthenticated requests.
 * This class implements Spring Security's AuthenticationEntryPoint to provide
 * a custom response when an unauthenticated user attempts to access a protected resource.
 * It returns a JSON response with an appropriate error message and HTTP 401 status code.
 * The response includes:
 * - HTTP 401 Unauthorized status code
 * - Content-Type: application/json header
 * - JSON body containing an error message
 */
@Component
public class UserAuthenticationEntryPoint implements AuthenticationEntryPoint {

    /** Object mapper for JSON serialization of error responses */
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private final MessageSource messageSource;

    public UserAuthenticationEntryPoint(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Handles unauthenticated requests by sending a JSON response with an error message.
     * This method is called when an unauthenticated user attempts to access a protected resource.
     * The response includes:
     * - HTTP 401 Unauthorized status code
     * - Content-Type: application/json header
    * - JSON body containing an error message resolved from i18n keys:
    *   - Uses the authentication exception message if present
    *   - Falls back to "Invalid or missing authentication token" when the exception has no message
    *   - Uses a generic authentication failure message if no exception is provided
     *
     * @param request The HTTP request that triggered the authentication failure
     * @param response The HTTP response to be sent back to the client
     * @param authException The authentication exception that occurred, containing details about the failure
     * @throws IOException if an I/O error occurs while writing the response
     * @throws ServletException if a servlet error occurs during request processing
     */
    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        
        String errorMessage = getMessage("security.auth.failed");
        if (authException != null) {
            String authMessage = authException.getMessage();
            if (authMessage != null && !authMessage.isEmpty()) {
                // Treat the exception message as a potential i18n key first.
                try {
                    errorMessage = getMessage(authMessage);
                } catch (NoSuchMessageException ignored) {
                    errorMessage = getMessage("security.auth.missingOrInvalidToken");
                }
            } else {
                errorMessage = getMessage("security.auth.missingOrInvalidToken");
            }
        }
        
        OBJECT_MAPPER.writeValue(response.getOutputStream(), new ErrorDto(errorMessage));
    }

    private String getMessage(String key) {
        return messageSource.getMessage(key, null, LocaleContextHolder.getLocale());
    }
}
