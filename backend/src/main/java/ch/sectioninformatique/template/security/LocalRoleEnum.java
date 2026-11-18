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
 * Enumeration of the <b>local roles</b>, which are defined only in this
 * application.
 *
 * <p>Unlike the {@link MainRoleEnum main roles} (owned by the external
 * spring-auth service), local roles are persisted in the {@code roles} table
 * (seeded by {@link RoleSeeder}), exposed by {@code GET /roles}, and assigned to
 * users as {@code appSpecificRoles}. They never leave this application.
 *
 * <p>To add a new local role, add a constant here with its description and
 * permission set; {@link RoleSeeder} will persist it automatically on startup.
 */
public enum LocalRoleEnum {

    /**
     * Example of a local application role which is specific to this app and is not
     * transmitted from the spring-auth application.
     */
    LOCAL_MANAGER("Example of local application role", EnumSet.of(
            ITEM_READ,
            ITEM_WRITE,
            ITEM_UPDATE,
            ITEM_DELETE));

    /** Human-readable description, used when seeding the role into the database */
    private final String description;

    /** Set of permissions associated with this role */
    private final Set<PermissionEnum> permissions;

    /**
     * Constructs a new LocalRoleEnum with the specified description and permissions.
     *
     * @param description A human-readable description of the role
     * @param permissions The set of permissions to be associated with this role
     */
    LocalRoleEnum(String description, Set<PermissionEnum> permissions) {
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
     * Returns the set of permissions associated with this role.
     *
     * @return The set of permissions for this role
     */
    public Set<PermissionEnum> getPermissions() {
        return permissions;
    }

    /**
     * Converts the role's permissions into Spring Security GrantedAuthority
     * objects.
     * This method creates SimpleGrantedAuthority objects for each permission and
     * adds a role-based authority (e.g., "ROLE_LOCAL_MANAGER").
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
