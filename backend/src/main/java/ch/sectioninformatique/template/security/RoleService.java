package ch.sectioninformatique.template.security;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

/**
 * Service layer for role-related operations.
 * Provides a clear boundary between controller logic and repository access.
 */
@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Returns the roles matching the requested {@link RoleScope}:
     * <ul>
     *   <li>{@link RoleScope#LOCAL} - the roles persisted in the {@code roles} table</li>
     *   <li>{@link RoleScope#MAIN} - the roles mirrored from spring-auth ({@link MainRoleEnum})</li>
     *   <li>{@link RoleScope#ALL} - both, main roles first</li>
     * </ul>
     *
     * @param scope which roles to return
     * @return the matching roles as {@link RoleDto}
     */
    public List<RoleDto> getRoles(RoleScope scope) {
        List<RoleDto> roles = new ArrayList<>();

        if (scope == RoleScope.MAIN || scope == RoleScope.ALL) {
            for (MainRoleEnum mainRole : MainRoleEnum.values()) {
                roles.add(RoleDto.ofMain(mainRole));
            }
        }

        if (scope == RoleScope.LOCAL || scope == RoleScope.ALL) {
            roleRepository.findAll().forEach(role -> roles.add(RoleDto.ofLocal(role)));
        }

        return roles;
    }

    /**
     * Finds a local role by its name.
     *
     * @param name local role enum to search for
     * @return Optional containing the Role if found
     */
    public Optional<Role> findByName(LocalRoleEnum name) {
        return roleRepository.findByName(name);
    }
}
