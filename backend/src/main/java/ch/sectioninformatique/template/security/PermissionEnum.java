package ch.sectioninformatique.template.security;

/**
 * Enumeration defining the available permissions in the application.
 * Each permission represents a specific action that can be performed
 * on a resource. Permissions are used in combination with roles
 * to implement fine-grained access control.
 */
public enum PermissionEnum {
    USER_READ("user:read"),
    USER_WRITE("user:write"),
    USER_UPDATE("user:update"),
    USER_DELETE("user:delete"),
    ITEM_READ("item:read"),
    ITEM_WRITE("item:write"),
    ITEM_UPDATE("item:update"),
    ITEM_DELETE("item:delete");

    /** The string representation of the permission used in Spring Security */
    private final String permission;

    /**
     * Constructs a new PermissionEnum with the specified permission string.
     *
     * @param permission The string representation of the permission
     */
    PermissionEnum(String permission) {
        this.permission = permission;
    }

    /**
     * Returns the string representation of the permission.
     * This string is used by Spring Security for authorization checks.
     *
     * @return The permission string (e.g., "user:read", "user:write")
     */
    public String getPermission() {
        return permission;
    }
}
