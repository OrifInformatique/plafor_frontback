package ch.sectioninformatique.template.security;

import java.util.List;

/**
 * Uniform view of a role for the {@code GET /roles} endpoint, covering both the
 * local roles persisted in the {@code roles} table and the main roles mirrored
 * from spring-auth (which have no database row).
 *
 * @param id          the database id, or {@code null} for a main role
 * @param name        the role name (enum constant name, e.g. {@code ADMIN})
 * @param description a human-readable description
 * @param type        {@code "MAIN"} for a spring-auth role, {@code "LOCAL"} for an app role
 * @param permissions the permission strings granted by the role (e.g. {@code item:read}), sorted
 */
public record RoleDto(
        Long id,
        String name,
        String description,
        String type,
        List<String> permissions) {

    /** Builds a DTO for a main role owned by spring-auth. */
    public static RoleDto ofMain(MainRoleEnum role) {
        return new RoleDto(null, role.name(), role.getDescription(), "MAIN",
                permissionStrings(role.getPermissions()));
    }

    /** Builds a DTO for a local role persisted in the {@code roles} table. */
    public static RoleDto ofLocal(Role role) {
        return new RoleDto(role.getId(), role.getName().name(), role.getDescription(), "LOCAL",
                permissionStrings(role.getName().getPermissions()));
    }

    private static List<String> permissionStrings(java.util.Set<PermissionEnum> permissions) {
        return permissions.stream()
                .map(PermissionEnum::getPermission)
                .sorted()
                .toList();
    }
}
