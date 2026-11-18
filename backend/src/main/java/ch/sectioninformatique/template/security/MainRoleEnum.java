package ch.sectioninformatique.template.security;

import java.util.EnumSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static ch.sectioninformatique.template.security.PermissionEnum.ITEM_READ;
import static ch.sectioninformatique.template.security.PermissionEnum.ITEM_WRITE;
import static ch.sectioninformatique.template.security.PermissionEnum.ITEM_UPDATE;
import static ch.sectioninformatique.template.security.PermissionEnum.ITEM_DELETE;

/**
 * Enumeration of the <b>main roles</b>, which are defined and managed by the
 * external <b>spring-auth</b> authentication provider.
 *
 * <p>These roles are <b>not</b> persisted or managed by this application: they
 * are transmitted in the {@code mainRole} claim of the JWT issued by spring-auth.
 * This enum is only a read-only mirror of that vocabulary, kept here so the
 * backend can grant <b>local</b> permissions to each main role.
 *
 * <p>The <b>global</b> permissions of a main role (e.g. {@code user:read}) are
 * owned by spring-auth and arrive in the JWT {@code permissions} claim; they must
 * <b>not</b> be repeated here. Each constant only lists the permissions specific
 * to this application, which are added on top of the ones from the token
 * (see {@link UserAuthenticationProvider#validateToken(String)}).
 *
 * <p>Roles local to this application live in {@link LocalRoleEnum} instead.
 *
 * The roles are hierarchical:
 * - USER: Read access to resources
 * - MANAGER: Resources management, without deletion
 * - ADMIN: Full access to Resources
 */
public enum MainRoleEnum {
    /**
     * Basic user role.
     * Can only read items.
     */
    USER("Basic user role with read-only access", EnumSet.of(
            ITEM_READ)),

    /**
     * Manager role with extended permissions.
     * Can manage items, but cannot delete them.
     */
    MANAGER("Manager role with item management, without deletion", EnumSet.of(
            ITEM_READ,
            ITEM_WRITE,
            ITEM_UPDATE)),

    /**
     * Administrator role with full access to resources.
     * Has all item permissions including deletion.
     */
    ADMIN("Administrator role with full access to resources", EnumSet.of(
            ITEM_READ,
            ITEM_WRITE,
            ITEM_UPDATE,
            ITEM_DELETE));

    /** Human-readable description of the role */
    private final String description;

    /** Set of local permissions associated with this role */
    private final Set<PermissionEnum> permissions;

    /**
     * Constructs a new MainRoleEnum with the specified description and permissions.
     *
     * @param description A human-readable description of the role
     * @param permissions The set of permissions to be associated with this role
     */
    MainRoleEnum(String description, Set<PermissionEnum> permissions) {
        this.description = description;
        this.permissions = permissions;
    }

    /**
     * Returns the human-readable description of the role.
     *
     * @return The role description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Returns the set of local permissions associated with this role.
     * Global permissions granted by spring-auth are not included.
     *
     * @return The set of local permissions for this role
     */
    public Set<PermissionEnum> getPermissions() {
        return permissions;
    }

    /**
     * Converts the role's permissions into Spring Security GrantedAuthority
     * objects.
     * This method creates SimpleGrantedAuthority objects for each permission and
     * adds a role-based authority (e.g., "ROLE_USER").
     *
     * @return Set of SimpleGrantedAuthority objects representing the role's
     *         permissions
     */
    public Set<SimpleGrantedAuthority> getGrantedAuthorities() {
        Set<SimpleGrantedAuthority> authorities = getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toSet());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
