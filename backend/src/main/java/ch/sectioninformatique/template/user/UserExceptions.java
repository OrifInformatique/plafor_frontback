package ch.sectioninformatique.template.user;

import ch.sectioninformatique.template.app.exceptions.AppException;
import ch.sectioninformatique.template.app.exceptions.MessageKeyProvider;
import org.springframework.http.HttpStatus;

/**
 * Container class for user-related exceptions.
 * This class groups all user-specific exceptions as static inner classes.
 */
public class UserExceptions {

    /**
     * Thrown when a user is not found.
     */
    public static class UserNotFoundException extends AppException implements MessageKeyProvider {
        private final String messageKey;
        private final Object[] messageArgs;

        public UserNotFoundException() {
            super(HttpStatus.NOT_FOUND);
            this.messageKey = "user.notFound";
            this.messageArgs = NO_ARGS;
        }

        public UserNotFoundException(String detail) {
            super(HttpStatus.NOT_FOUND);
            this.messageKey = "user.notFound";
            this.messageArgs = NO_ARGS;
        }

        public UserNotFoundException(Long userId) {
            super(HttpStatus.NOT_FOUND);
            this.messageKey = "user.notFound.id";
            this.messageArgs = new Object[] { userId };
        }

        @Override
        public String getMessageKey() {
            return messageKey;
        }

        @Override
        public Object[] getMessageArgs() {
            return messageArgs;
        }
    }

    /**
     * Thrown when a user is not found by login.
     */
    public static class UserNotFoundByLoginException extends AppException implements MessageKeyProvider {
        private final String login;

        public UserNotFoundByLoginException(String login) {
            super(HttpStatus.NOT_FOUND);
            this.login = login;
        }

        @Override
        public String getMessageKey() {
            return "user.notFound.login";
        }

        @Override
        public Object[] getMessageArgs() {
            return new Object[] { login };
        }
    }

    /**
     * Thrown when a user already has a specific role.
     */
    public static class UserAlreadyHasRoleException extends AppException implements MessageKeyProvider {
        private final String roleName;

        public UserAlreadyHasRoleException(String roleName) {
            super(HttpStatus.CONFLICT);
            this.roleName = roleName;
        }

        public UserAlreadyHasRoleException() {
            super(HttpStatus.CONFLICT);
            this.roleName = null;
        }

        @Override
        public String getMessageKey() {
            return "user.role.alreadyHas";
        }

        @Override
        public Object[] getMessageArgs() {
            return roleName == null ? NO_ARGS : new Object[] { roleName };
        }
    }

    /**
     * Thrown when a user creation operation fails.
     */
    public static class UserCreationException extends AppException implements MessageKeyProvider {
        private final String detail;

        public UserCreationException(String detail) {
            super(HttpStatus.BAD_REQUEST);
            this.detail = detail;
        }

        public UserCreationException() {
            super(HttpStatus.BAD_REQUEST);
            this.detail = null;
        }

        @Override
        public String getMessageKey() {
            return "user.create.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }

    /**
     * Thrown when a user update operation fails.
     */
    public static class UserUpdateException extends AppException implements MessageKeyProvider {
        private final String detail;

        public UserUpdateException(String detail) {
            super(HttpStatus.BAD_REQUEST);
            this.detail = detail;
        }

        public UserUpdateException() {
            super(HttpStatus.BAD_REQUEST);
            this.detail = null;
        }

        @Override
        public String getMessageKey() {
            return "user.update.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }

    /**
     * Thrown when a user deletion operation fails.
     */
    public static class UserDeletionException extends AppException implements MessageKeyProvider {
        private final String messageKey;
        private final Object[] messageArgs;

        public UserDeletionException(String detail) {
            super(HttpStatus.BAD_REQUEST);
            this.messageKey = "user.delete.failed";
            this.messageArgs = new Object[] { detail };
        }

        public UserDeletionException(String messageKey, boolean useKey) {
            super(HttpStatus.BAD_REQUEST);
            // Allows callers to pass a direct i18n key from upstream services.
            this.messageKey = messageKey;
            this.messageArgs = NO_ARGS;
        }

        public UserDeletionException() {
            super(HttpStatus.BAD_REQUEST);
            this.messageKey = "user.delete.failed";
            this.messageArgs = NO_ARGS;
        }

        @Override
        public String getMessageKey() {
            return messageKey;
        }

        @Override
        public Object[] getMessageArgs() {
            return messageArgs;
        }
    }

    /**
     * Thrown when attempting to delete a user that is already soft-deleted.
     */
    public static class UserAlreadyDeletedException extends AppException implements MessageKeyProvider {
        private final String messageKey;
        private final Object[] messageArgs;

        public UserAlreadyDeletedException() {
            super(HttpStatus.CONFLICT);
            this.messageKey = "user.alreadyDeleted";
            this.messageArgs = NO_ARGS;
        }

        public UserAlreadyDeletedException(Long userId) {
            super(HttpStatus.CONFLICT);
            this.messageKey = "user.alreadyDeleted.id";
            this.messageArgs = new Object[] { userId };
        }

        @Override
        public String getMessageKey() {
            return messageKey;
        }

        @Override
        public Object[] getMessageArgs() {
            return messageArgs;
        }
    }

    /**
     * Thrown when a role promotion operation fails.
     */
    public static class UserPromotionException extends AppException implements MessageKeyProvider {
        private final String detail;

        public UserPromotionException(String detail) {
            super(HttpStatus.BAD_REQUEST);
            this.detail = detail;
        }

        @Override
        public String getMessageKey() {
            return "user.promote.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }

    /**
     * Thrown when a role is not found.
     */
    public static class RoleNotFoundException extends AppException implements MessageKeyProvider {
        private final String roleName;

        public RoleNotFoundException(String roleName) {
            super(HttpStatus.NOT_FOUND);
            this.roleName = roleName;
        }

        public RoleNotFoundException() {
            super(HttpStatus.NOT_FOUND);
            this.roleName = null;
        }

        @Override
        public String getMessageKey() {
            return "user.role.notFound";
        }

        @Override
        public Object[] getMessageArgs() {
            return roleName == null ? NO_ARGS : new Object[] { roleName };
        }
    }

    /**
     * Thrown when the default role is not found during user creation.
     */
    public static class DefaultRoleNotFoundException extends AppException implements MessageKeyProvider {
        public DefaultRoleNotFoundException() {
            super(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        @Override
        public String getMessageKey() {
            return "user.role.defaultNotFound";
        }
    }

    /**
     * Thrown when user data validation fails.
     */
    public static class UserValidationException extends AppException implements MessageKeyProvider {
        private final String messageKey;
        private final Object[] messageArgs;

        public UserValidationException(String detail) {
            super(HttpStatus.BAD_REQUEST);
            this.messageKey = "user.validation.failed";
            this.messageArgs = new Object[] { detail };
        }

        public UserValidationException(String messageKey, boolean useKey) {
            super(HttpStatus.BAD_REQUEST);
            this.messageKey = messageKey;
            this.messageArgs = NO_ARGS;
        }

        @Override
        public String getMessageKey() {
            return messageKey;
        }

        @Override
        public Object[] getMessageArgs() {
            return messageArgs;
        }
    }

    /**
     * Thrown when a user mapping operation fails.
     */
    public static class UserMappingException extends AppException implements MessageKeyProvider {
        private final String detail;

        public UserMappingException(String detail) {
            super(HttpStatus.INTERNAL_SERVER_ERROR);
            this.detail = detail;
        }

        @Override
        public String getMessageKey() {
            return "user.mapping.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }

    /**
     * Thrown when user seeding operation fails.
     */
    public static class UserSeedingException extends AppException implements MessageKeyProvider {
        private final String detail;

        public UserSeedingException(String detail) {
            super(HttpStatus.INTERNAL_SERVER_ERROR);
            this.detail = detail;
        }

        @Override
        public String getMessageKey() {
            return "user.seeding.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }

    /**
     * Thrown when user retrieval operation fails.
     */
    public static class UserRetrievalException extends AppException implements MessageKeyProvider {
        private final String detail;

        public UserRetrievalException(String detail) {
            super(HttpStatus.INTERNAL_SERVER_ERROR);
            this.detail = detail;
        }

        @Override
        public String getMessageKey() {
            return "user.retrieve.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }

    /**
     * Thrown when attempting to perform an operation on an inactive user.
     */
    public static class InactiveUserException extends AppException implements MessageKeyProvider {
        public InactiveUserException() {
            super(HttpStatus.FORBIDDEN);
        }

        public InactiveUserException(String detail) {
            super(HttpStatus.FORBIDDEN);
        }

        @Override
        public String getMessageKey() {
            return "user.inactive";
        }
    }

    /**
     * Thrown when a user's main role update fails.
     */
    public static class UserRoleUpdateException extends AppException implements MessageKeyProvider {
        private final String detail;

        public UserRoleUpdateException(String detail) {
            super(HttpStatus.BAD_REQUEST);
            this.detail = detail;
        }

        @Override
        public String getMessageKey() {
            return "user.role.update.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }

    /**
     * Thrown when duplicate user data is detected.
     */
    public static class DuplicateUserException extends AppException implements MessageKeyProvider {
        private final String detail;

        public DuplicateUserException(String detail) {
            super(HttpStatus.CONFLICT);
            this.detail = detail;
        }

        public DuplicateUserException() {
            super(HttpStatus.CONFLICT);
            this.detail = null;
        }

        @Override
        public String getMessageKey() {
            return "user.duplicate";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }

    /**
     * Thrown when a permanent user deletion operation fails.
     */
    public static class PermanentUserDeletionException extends AppException implements MessageKeyProvider {
        private final String detail;

        public PermanentUserDeletionException(String detail) {
            super(HttpStatus.BAD_REQUEST);
            this.detail = detail;
        }

        public PermanentUserDeletionException() {
            super(HttpStatus.BAD_REQUEST);
            this.detail = null;
        }

        @Override
        public String getMessageKey() {
            return "user.delete.permanent.failed";
        }

        @Override
        public Object[] getMessageArgs() {
            return detail == null ? NO_ARGS : new Object[] { detail };
        }
    }
}
