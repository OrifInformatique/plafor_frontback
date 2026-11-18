package ch.sectioninformatique.template.user;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for {@link UserDto}.
 * This class tests the functionality of the UserDto class, including:
 * - Default values initialization
 * - Builder pattern usage
 * - Field access and modification
 * - Permission management
 */
class UserDtoTest {

    private static final Long TEST_ID = 1L;
    private static final String TEST_FIRST_NAME = "John";
    private static final String TEST_LAST_NAME = "Doe";
    private static final String TEST_LOGIN = "john.doe@example.com";
    private static final String TEST_TOKEN = "test-token";
    private static final String TEST_ROLE = "USER";
    private static final List<String> TEST_PERMISSIONS = Arrays.asList("read", "write");

    /**
     * Tests the default values initialization.
     * Verifies that:
     * - Role defaults to "USER"
     * - Permissions list is initialized but empty
     */
    @Test
    void testDefaultValues() {
        // When
        UserDto userDto = UserDto.builder().build();

        // Then
        assertEquals("USER", userDto.getMainRole());
        assertNotNull(userDto.getPermissions());
        assertTrue(userDto.getPermissions().isEmpty());
    }

    /**
     * Tests the builder pattern with all fields.
     * Verifies that:
     * - All fields are correctly set
     * - Values can be retrieved
     */
    @Test
    void testBuilderWithAllFields() {
        // When
        UserDto userDto = UserDto.builder()
                .id(TEST_ID)
                .firstName(TEST_FIRST_NAME)
                .lastName(TEST_LAST_NAME)
                .login(TEST_LOGIN)
                .token(TEST_TOKEN)
                .mainRole(TEST_ROLE)
                .permissions(TEST_PERMISSIONS)
                .build();

        // Then
        assertEquals(TEST_ID, userDto.getId());
        assertEquals(TEST_FIRST_NAME, userDto.getFirstName());
        assertEquals(TEST_LAST_NAME, userDto.getLastName());
        assertEquals(TEST_LOGIN, userDto.getLogin());
        assertEquals(TEST_TOKEN, userDto.getToken());
        assertEquals(TEST_ROLE, userDto.getMainRole());
        assertEquals(TEST_PERMISSIONS, userDto.getPermissions());
    }

    /**
     * Tests the toBuilder method.
     * Verifies that:
     * - A new instance can be created from an existing one
     * - Fields can be modified while keeping others unchanged
     */
    @Test
    void testToBuilder() {
        // Given
        UserDto original = UserDto.builder()
                .id(TEST_ID)
                .firstName(TEST_FIRST_NAME)
                .lastName(TEST_LAST_NAME)
                .login(TEST_LOGIN)
                .mainRole(TEST_ROLE)
                .build();

        // When
        UserDto modified = original.toBuilder()
                .firstName("Jane")
                .build();

        // Then
        assertEquals(TEST_ID, modified.getId());
        assertEquals("Jane", modified.getFirstName());
        assertEquals(TEST_LAST_NAME, modified.getLastName());
        assertEquals(TEST_LOGIN, modified.getLogin());
    }

    /**
     * Tests permission management.
     * Verifies that:
     * - Permissions can be added
     * - Permissions list is mutable
     */
    @Test
    void testPermissionManagement() {
        // Given
        UserDto userDto = UserDto.builder().build();

        // When
        userDto.getPermissions().add("read");
        userDto.getPermissions().add("write");

        // Then
        assertEquals(2, userDto.getPermissions().size());
        assertTrue(userDto.getPermissions().contains("read"));
        assertTrue(userDto.getPermissions().contains("write"));
    }
} 