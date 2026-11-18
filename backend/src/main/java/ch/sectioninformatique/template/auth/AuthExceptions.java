package ch.sectioninformatique.template.auth;

import org.springframework.http.HttpStatus;

import ch.sectioninformatique.template.app.exceptions.AppException;
import ch.sectioninformatique.template.app.exceptions.MessageKeyProvider;

/**
 * Container class for authentication and authorization related exceptions.
 * This class groups all auth-specific exceptions as static inner classes.
 */
public class AuthExceptions {

    /**
     * Thrown when provided credentials are invalid.
     */
    public static class InvalidCredentialsException extends AppException implements MessageKeyProvider {
        public InvalidCredentialsException() {
            super(HttpStatus.UNAUTHORIZED);
        }

        public String getMessageKey() {
            return "auth.invalidCredentials";
        }
    }

    /**
     * Thrown when a user registration fails.
     */
    public static class RegistrationFailedException extends AppException implements MessageKeyProvider {
        private final String detail;

        public RegistrationFailedException(String detail) {
            super(HttpStatus.BAD_REQUEST);
            // Preserve the auth-service detail as a formatting arg for i18n.
            this.detail = detail;
        }

        @Override
        public String getMessageKey() {
            return "auth.register.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return new Object[] { detail };
        }
    }

    /**
     * Thrown when a user is not found during authentication.
     */
    public static class UserNotFoundException extends AppException implements MessageKeyProvider {
        public UserNotFoundException() {
            super(HttpStatus.NOT_FOUND);
        }

        public UserNotFoundException(String detail) {
            super(HttpStatus.NOT_FOUND);
        }

        @Override
        public String getMessageKey() {
            return "user.notFound";
        }
    }

    /**
     * Thrown when a user already exists during registration.
     */
    public static class UserAlreadyExistsException extends AppException implements MessageKeyProvider {
        public UserAlreadyExistsException() {
            super(HttpStatus.CONFLICT);
        }

        public UserAlreadyExistsException(String detail) {
            super(HttpStatus.CONFLICT);
        }

        @Override
        public String getMessageKey() {
            return "auth.userAlreadyExists";
        }
    }

    /**
     * Thrown when password update fails.
     */
    public static class PasswordUpdateFailedException extends AppException implements MessageKeyProvider {
        private final String detail;

        public PasswordUpdateFailedException(String detail) {
            super(HttpStatus.BAD_REQUEST);
            this.detail = detail;
        }

        @Override
        public String getMessageKey() {
            return "auth.password.update.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return new Object[] { detail };
        }
    }

    /**
     * Thrown when OAuth2 authentication fails.
     */
    public static class OAuth2AuthenticationException extends AppException implements MessageKeyProvider {
        private final String detail;

        public OAuth2AuthenticationException(String detail) {
            super(HttpStatus.UNAUTHORIZED);
            this.detail = detail;
        }

        @Override
        public String getMessageKey() {
            return "auth.oauth2.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return new Object[] { detail };
        }
    }

    /**
     * Thrown when a login is already taken.
     */
    public static class LoginAlreadyExistsException extends AppException implements MessageKeyProvider {
        public LoginAlreadyExistsException() {
            super(HttpStatus.BAD_REQUEST);
        }

        public LoginAlreadyExistsException(String detail) {
            super(HttpStatus.BAD_REQUEST);
        }

        @Override
        public String getMessageKey() {
            return "auth.loginAlreadyExists";
        }
    }

    public static class AuthCodeNotFoundException extends AppException implements MessageKeyProvider{
        public AuthCodeNotFoundException(){
            super(HttpStatus.NOT_FOUND);
        }

        @Override
        public String getMessageKey(){
            return "auth.code.not.found";
        }
    }
}
