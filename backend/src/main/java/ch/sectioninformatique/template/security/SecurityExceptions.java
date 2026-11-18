package ch.sectioninformatique.template.security;

import ch.sectioninformatique.template.app.exceptions.AppException;
import ch.sectioninformatique.template.app.exceptions.MessageKeyProvider;
import org.springframework.http.HttpStatus;

/**
 * Container class for security-related exceptions.
 * This class groups all security-specific exceptions as static inner classes.
 */
public class SecurityExceptions {

    /**
     * Thrown when an authentication token is invalid or expired.
     */
    public static class InvalidTokenException extends AppException implements MessageKeyProvider {
        public InvalidTokenException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        public InvalidTokenException(String detail) {
            super(HttpStatus.UNAUTHORIZED);
        }

        @Override
        public String getMessageKey() {
            return "security.token.invalid";
        }
    }

    /**
     * Thrown when a refresh token is invalid or expired.
     */
    public static class InvalidRefreshTokenException extends AppException implements MessageKeyProvider {
        public InvalidRefreshTokenException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        public InvalidRefreshTokenException(String detail) {
            super(HttpStatus.UNAUTHORIZED);
        }

        @Override
        public String getMessageKey() {
            return "security.refresh.invalid";
        }
    }

    /**
     * Thrown when JWT token verification fails.
     */
    public static class JwtVerificationException extends AppException implements MessageKeyProvider {
        public JwtVerificationException(String detail) {
            super(HttpStatus.UNAUTHORIZED);
        }

        public JwtVerificationException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        @Override
        public String getMessageKey() {
            return "security.jwt.verificationFailed";
        }
    }

    /**
     * Thrown when JWT token has expired.
     */
    public static class JwtTokenExpiredException extends AppException implements MessageKeyProvider {
        public JwtTokenExpiredException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        @Override
        public String getMessageKey() {
            return "security.jwt.expired";
        }
    }

    /**
     * Thrown when JWT token signature is invalid.
     */
    public static class InvalidJwtSignatureException extends AppException implements MessageKeyProvider {
        public InvalidJwtSignatureException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        @Override
        public String getMessageKey() {
            return "security.jwt.invalidSignature";
        }
    }

    /**
     * Thrown when JWT token format is malformed.
     */
    public static class MalformedJwtException extends AppException implements MessageKeyProvider {
        public MalformedJwtException() {
            super(HttpStatus.BAD_REQUEST);
        }

        public MalformedJwtException(String detail) {
            super(HttpStatus.BAD_REQUEST);
        }

        @Override
        public String getMessageKey() {
            return "security.jwt.malformed";
        }
    }

    /**
     * Thrown when the token type is invalid for a specific endpoint.
     */
    public static class InvalidTokenTypeException extends AppException implements MessageKeyProvider {
        public InvalidTokenTypeException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        public InvalidTokenTypeException(String detail) {
            super(HttpStatus.UNAUTHORIZED);
        }

        @Override
        public String getMessageKey() {
            return "security.jwt.invalidType";
        }
    }

    /**
     * Thrown when authentication is required but not provided.
     */
    public static class AuthenticationRequiredException extends AppException implements MessageKeyProvider {
        public AuthenticationRequiredException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        @Override
        public String getMessageKey() {
            return "security.auth.required";
        }
    }

    /**
     * Thrown when the Authorization header is missing.
     */
    public static class MissingAuthorizationHeaderException extends AppException implements MessageKeyProvider {
        public MissingAuthorizationHeaderException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        @Override
        public String getMessageKey() {
            return "security.authHeader.missing";
        }
    }

    /**
     * Thrown when the Authorization header format is invalid.
     */
    public static class InvalidAuthorizationHeaderException extends AppException implements MessageKeyProvider {
        public InvalidAuthorizationHeaderException() {
            super(HttpStatus.BAD_REQUEST);
        }

        @Override
        public String getMessageKey() {
            return "security.authHeader.invalidFormat";
        }
    }

    /**
     * Thrown when access to a resource is denied due to insufficient permissions.
     */
    public static class AccessDeniedException extends AppException implements MessageKeyProvider {
        public AccessDeniedException() {
            super(HttpStatus.FORBIDDEN);
        }

        public AccessDeniedException(String detail) {
            super(HttpStatus.FORBIDDEN);
        }

        @Override
        public String getMessageKey() {
            return "error.accessDenied";
        }
    }

    /**
     * Thrown when a user lacks the required role for an operation.
     */
    public static class InsufficientRoleException extends AppException implements MessageKeyProvider {
        private final String requiredRole;

        public InsufficientRoleException(String requiredRole) {
            super(HttpStatus.FORBIDDEN);
            this.requiredRole = requiredRole;
        }

        public InsufficientRoleException() {
            super(HttpStatus.FORBIDDEN);
            this.requiredRole = null;
        }

        @Override
        public String getMessageKey() {
            return "security.role.insufficient";
        }

        @Override
        public Object[] getMessageArgs() {
            return requiredRole == null ? NO_ARGS : new Object[] { requiredRole };
        }
    }

    /**
     * Thrown when a user lacks the required permission for an operation.
     */
    public static class InsufficientPermissionException extends AppException implements MessageKeyProvider {
        private final String requiredPermission;

        public InsufficientPermissionException(String requiredPermission) {
            super(HttpStatus.FORBIDDEN);
            this.requiredPermission = requiredPermission;
        }

        public InsufficientPermissionException() {
            super(HttpStatus.FORBIDDEN);
            this.requiredPermission = null;
        }

        @Override
        public String getMessageKey() {
            return "security.permission.insufficient";
        }

        @Override
        public Object[] getMessageArgs() {
            return requiredPermission == null ? NO_ARGS : new Object[] { requiredPermission };
        }
    }

    /**
     * Thrown when security context is invalid or corrupted.
     */
    public static class InvalidSecurityContextException extends AppException implements MessageKeyProvider {
        public InvalidSecurityContextException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        public InvalidSecurityContextException(String detail) {
            super(HttpStatus.UNAUTHORIZED);
        }

        @Override
        public String getMessageKey() {
            return "security.context.invalid";
        }
    }

    /**
     * Thrown when JWT token creation fails.
     */
    public static class TokenCreationException extends AppException implements MessageKeyProvider {
        private final String detail;

        public TokenCreationException(String detail) {
            super(HttpStatus.INTERNAL_SERVER_ERROR);
            this.detail = detail;
        }

        public TokenCreationException() {
            super(HttpStatus.INTERNAL_SERVER_ERROR);
            this.detail = null;
        }

        @Override
        public String getMessageKey() {
            return "security.token.creationFailed";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }

    /**
     * Thrown when security configuration fails.
     */
    public static class SecurityConfigurationException extends AppException implements MessageKeyProvider {
        private final String detail;

        public SecurityConfigurationException(String detail) {
            super(HttpStatus.INTERNAL_SERVER_ERROR);
            this.detail = detail;
        }

        @Override
        public String getMessageKey() {
            return "security.config.error";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }

    /**
     * Thrown when CORS configuration is violated.
     */
    public static class CorsViolationException extends AppException implements MessageKeyProvider {
        public CorsViolationException() {
            super(HttpStatus.FORBIDDEN);
        }

        public CorsViolationException(String detail) {
            super(HttpStatus.FORBIDDEN);
        }

        @Override
        public String getMessageKey() {
            return "security.cors.violation";
        }
    }

    /**
     * Thrown when session has expired or is invalid.
     */
    public static class InvalidSessionException extends AppException implements MessageKeyProvider {
        public InvalidSessionException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        public InvalidSessionException(String detail) {
            super(HttpStatus.UNAUTHORIZED);
        }

        @Override
        public String getMessageKey() {
            return "security.session.invalid";
        }
    }

    /**
     * Thrown when authentication provider fails.
     */
    public static class AuthenticationProviderException extends AppException implements MessageKeyProvider {
        private final String detail;

        public AuthenticationProviderException(String detail) {
            super(HttpStatus.INTERNAL_SERVER_ERROR);
            // Keep the upstream provider detail for i18n formatting.
            this.detail = detail;
        }

        @Override
        public String getMessageKey() {
            return "security.authProvider.error";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }
}
