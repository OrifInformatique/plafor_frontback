package ch.sectioninformatique.template.user;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import ch.sectioninformatique.template.security.MainRoleEnum;

import org.springframework.core.annotation.Order;

import java.util.Arrays;

/**
 * Seeder class for initializing the database with default user data.
 * This class implements CommandLineRunner to execute the seeding process
 * when the application starts. It creates a set of predefined users with
 * different roles (USER, MANAGER, ADMIN) for testing and development purposes.
 * The seeder runs after the RoleSeeder (Order(2)) to ensure roles exist before
 * creating users.
 */
@Component
@Order(2)
@Profile({ "test" })
public class TestUserSeeder implements CommandLineRunner {

	/** Repository for user data access */
	private final UserRepository userRepository;

	/**
	 * Constructs a new UserSeeder with the required dependencies.
	 *
	 * @param userRepository Repository for user data access
	 */
	public TestUserSeeder(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * Executes the seeding process when the application starts.
	 * This method is called by Spring Boot after the application context is loaded.
	 * It:
	 * 1. Prints a start message
	 * 2. Calls loadUserData() to create default users
	 * 3. Prints a completion message
	 *
	 * @param args Command line arguments passed to the application
	 * @throws Exception if an error occurs during the seeding process
	 */
	@Override
	public void run(String... args) throws Exception {
		System.out.println("Starting User Seeding...");
		loadUserData();
		System.out.println("User Seeding completed.");
	}

	/**
	 * Loads initial user data into the database.
	 * Creates a set of predefined users with different roles if the database is
	 * empty.
	 * The users include:
	 * - A deleted user (ID 1)
	 * - Regular users with USER role (John Doe, Alice Johnson, Dan Sergeant, etc.)
	 * - An admin user with MANAGER role (Jane Smith)
	 * - A super admin user with ADMIN role (Super Admin)
	 * 
	 * Each user is created with:
	 * - Unique login (email format)
	 * - Secure password (hashed)
	 * - First and last name
	 * - Appropriate role(s)
	 *
	 */
	private void loadUserData() {
		if (this.userRepository.count() == 0) {

			// Create users with User.builder()

			User testUser = User.builder()
					.firstName("Test")
					.lastName("User")
					.login("test.user@test.com")
					.mainRole(MainRoleEnum.USER)
					.build();

			User testManager = User.builder()
					.firstName("Test")
					.lastName("Manager")
					.login("test.manager@test.com")
					.mainRole(MainRoleEnum.MANAGER)
					.build();

			User testAdmin = User.builder()
					.firstName("Test")
					.lastName("Admin")
					.login("test.admin@test.com")
					.mainRole(MainRoleEnum.ADMIN)
					.build();

			User testAdmin2 = User.builder()
					.firstName("Test2")
					.lastName("Admin2")
					.login("test.admin2@test.com")
					.mainRole(MainRoleEnum.ADMIN)
					.build();

			userRepository.saveAll(Arrays.asList(testUser, testManager, testAdmin, testAdmin2));
		} else {
			System.out.println("Users table not empty - Skipping user seeding");
		}
	}
}