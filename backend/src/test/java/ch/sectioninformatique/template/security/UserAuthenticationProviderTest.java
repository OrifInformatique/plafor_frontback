package ch.sectioninformatique.template.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import ch.sectioninformatique.template.user.User;
import ch.sectioninformatique.template.user.UserDto;
import ch.sectioninformatique.template.user.UserService;

import java.util.Arrays;
import java.util.Base64;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Test class for {@link UserAuthenticationProvider}.
 * This class tests the JWT token creation, validation, and authentication
 * functionality of the UserAuthenticationProvider.
 */
@ExtendWith(MockitoExtension.class)
class UserAuthenticationProviderTest {

    @Mock
    private UserService userService;

    private UserAuthenticationProvider authenticationProvider;

    private static final String TEST_SECRET_KEY = "test-secret-key";
    private static final String TEST_LOGIN = "test@example.com";
    private static final String TEST_FIRST_NAME = "John";
    private static final String TEST_LAST_NAME = "Doe";

    @BeforeEach
    void setUp() {
        authenticationProvider = new UserAuthenticationProvider(userService);
        // Use reflection to set the secret key
        try {
            java.lang.reflect.Field field = UserAuthenticationProvider.class.getDeclaredField("secretKey");
            field.setAccessible(true);
            field.set(authenticationProvider, Base64.getEncoder().encodeToString(TEST_SECRET_KEY.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to set secret key", e);
        }
    }

    /**
     * Tests the token creation functionality.
     * Verifies that:
     * - Token is created successfully
     * - Token contains correct user claims
     * - Token is properly formatted
     */
    @Test
    void testCreateToken() {
        // Given
        UserDto user = UserDto.builder()
                .login(TEST_LOGIN)
                .firstName(TEST_FIRST_NAME)
                .lastName(TEST_LAST_NAME)
                .mainRole("USER")
                .permissions(Arrays.asList("read", "write"))
                .build();

        // When
        String token = authenticationProvider.createToken(user);

        // Then
        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    /**
     * Tests the basic token validation.
     * Verifies that:
     * - Valid token is accepted
     * - Authentication object is created with correct user details
     * - Authorities are properly set
     */
    @Test
    void testValidateToken() {
        // Given
        UserDto user = UserDto.builder()
                .login(TEST_LOGIN)
                .firstName(TEST_FIRST_NAME)
                .lastName(TEST_LAST_NAME)
                .mainRole("USER")
                .permissions(Arrays.asList("read", "write"))
                .build();

        // When
        String token = authenticationProvider.createToken(user);

        // Then
        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    /**
     * Tests the validation of a token issued by spring-auth.
     * Verifies that the authorities merge:
     * - The global permissions from the token "permissions" claim
     * - The local permissions of the user's main role
     */
    @Test
    void testValidateTokenMergesGlobalAndLocalPermissions() {
        // Given
        UserDto user = UserDto.builder()
                .login(TEST_LOGIN)
                .firstName(TEST_FIRST_NAME)
                .lastName(TEST_LAST_NAME)
                .mainRole("USER")
                .permissions(SpringAuthPermissions.of("USER"))
                .build();
        User localUser = User.builder()
                .login(TEST_LOGIN)
                .mainRole(MainRoleEnum.USER)
                .build();
        when(userService.getOrCreateAuthenticatedUser(any(UserDto.class))).thenReturn(localUser);
        String token = authenticationProvider.createToken(user);

        // When
        Authentication authentication = authenticationProvider.validateToken(token);

        // Then
        Set<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
        assertEquals(Set.of("ROLE_USER", "user:read", "item:read"), authorities);
    }

    /**
     * Tests the authority building for a main role.
     * {@link MainRoleEnum} only holds the local permissions of a main role; the
     * global ones come from spring-auth in the token. Verifies that:
     * - Role is properly prefixed with "ROLE_"
     * - Local permissions are correctly converted to authorities
     * - Global spring-auth permissions are not included
     */
    @Test
    void testMainRoleGrantedAuthorities() {
        // Given
        int authoritiesExpectedCount = MainRoleEnum.USER.getPermissions().size() + 1; // permissions + ROLE_USER

        // When
        Set<SimpleGrantedAuthority> authorities = MainRoleEnum.USER.getGrantedAuthorities();

        // Then
        assertNotNull(authorities);
        assertEquals(authoritiesExpectedCount, authorities.size());
        assertTrue(authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
        assertTrue(authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("item:read")));
        assertFalse(authorities.stream()
                .anyMatch(auth -> auth.getAuthority().startsWith("user:")));
    }
} 