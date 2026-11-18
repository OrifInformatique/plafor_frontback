package ch.sectioninformatique.template.security;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/roles")
public class RoleController {
    private final RoleService roleService;

    RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    /**
     * Retrieves roles, filtered by their scope.
     * <ul>
     *   <li>{@code ?scope=local} (default) - only roles defined in this application</li>
     *   <li>{@code ?scope=main} - only the main roles owned by spring-auth</li>
     *   <li>{@code ?scope=all} - both, main roles first</li>
     * </ul>
     *
     * @param scope which roles to return (default {@code local})
     * @return a ResponseEntity containing the matching list of roles
     */
    @GetMapping
    public ResponseEntity<List<RoleDto>> getRoles(
            @RequestParam(defaultValue = "local") RoleScope scope) {
        return ResponseEntity.ok().body(roleService.getRoles(scope));
    }
}
