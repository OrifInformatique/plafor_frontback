package ch.sectioninformatique.template.security;

import java.util.List;

import ch.sectioninformatique.template.user.UserDto;

/**
 * Test helper simulating the global permissions granted by the external
 * spring-auth service.
 *
 * <p>In production, spring-auth puts the global permissions of the user's main
 * role in the JWT {@code permissions} claim. Tests create their own tokens, so
 * this helper fills {@link UserDto#getPermissions()} the same way spring-auth
 * would, before the DTO is passed to
 * {@link UserAuthenticationProvider#createToken(UserDto)}.
 *
 * <p>Keep this mapping in sync with spring-auth's {@code RoleEnum}.
 */
public final class SpringAuthPermissions {

    private SpringAuthPermissions() {
    }

    /**
     * Returns the global permissions spring-auth grants to a main role,
     * including its {@code ROLE_*} authority.
     *
     * @param mainRole The main role name (USER, MANAGER or ADMIN)
     * @return The permission strings spring-auth puts in the token
     */
    public static List<String> of(String mainRole) {
        return switch (mainRole) {
            case "ADMIN" -> List.of("ROLE_ADMIN", "user:read", "user:write", "user:update", "user:delete");
            case "MANAGER" -> List.of("ROLE_MANAGER", "user:read", "user:write", "user:update");
            default -> List.of("ROLE_USER", "user:read");
        };
    }

    /**
     * Replaces the user's permissions with the ones spring-auth would grant to
     * its main role.
     *
     * @param user The user to update
     * @return The same user, for chaining into {@code createToken}
     */
    public static UserDto grant(UserDto user) {
        user.setPermissions(of(user.getMainRole()));
        return user;
    }
}
