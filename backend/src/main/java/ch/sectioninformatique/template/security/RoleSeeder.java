package ch.sectioninformatique.template.security;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;

import java.util.Optional;

/**
 * Seeder class for initializing the database with the default <b>local</b> roles.
 * This class implements ApplicationListener to execute the seeding process
 * when the application context is refreshed. It creates every {@link LocalRoleEnum}
 * role that does not already exist in the database. The {@link MainRoleEnum main
 * roles} are owned by spring-auth and are never seeded here.
 */
@Component
public class RoleSeeder implements ApplicationListener<ContextRefreshedEvent> {

    /** Repository for role data access */
    private final RoleRepository roleRepository;

    /**
     * Constructs a new RoleSeeder with the required repository.
     *
     * @param roleRepository Repository for role data access
     */
    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Handles the application context refresh event by loading roles.
     * This method is called by Spring when the application context is refreshed.
     *
     * @param contextRefreshedEvent The event indicating that the application context has been refreshed
     */
    @Override
    public void onApplicationEvent(@NonNull ContextRefreshedEvent contextRefreshedEvent) {
        this.loadRoles();
    }

    /**
     * Loads the default local roles into the database.
     * Creates every {@link LocalRoleEnum} constant (e.g. LOCAL_MANAGER) that does
     * not already exist, using the description carried by the enum constant.
     */
    private void loadRoles() {
        for (LocalRoleEnum roleName : LocalRoleEnum.values()) {
            Optional<Role> optionalRole = roleRepository.findByName(roleName);
            optionalRole.ifPresentOrElse(System.out::println, () -> {
                Role roleToCreate = new Role();
                roleToCreate.setName(roleName);
                roleToCreate.setDescription(roleName.getDescription());
                roleRepository.save(roleToCreate);
            });
        }
    }
}
