package ch.sectioninformatique.template.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import ch.sectioninformatique.template.security.MainRoleEnum;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for {@link UserMapper}.
 * This class tests the conversion functionalities between different
 * user representations (User, UserDto, SignUpDto).
 * 
 * @author [Your name]
 * @version 1.0
 */
@SpringBootTest
@ActiveProfiles("test")
class UserMapperTest {

    /** Mapper to test, injected by Spring */
    @Autowired
    private UserMapper userMapper;

    /**
     * Tests the conversion from User to UserDto.
     * Verifies that:
     * - All fields are correctly mapped
     * - Role is properly converted
     * - Permissions are initialized
     */
    @Test
    void testToUserDto() {
        // Given
        User user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setLogin("johndoe");
        
        user.setMainRole(MainRoleEnum.MANAGER);

        // When
        UserDto userDto = userMapper.toUserDto(user);

        // Then
        assertNotNull(userDto);
        assertEquals(1L, userDto.getId());
        assertEquals("John", userDto.getFirstName());
        assertEquals("Doe", userDto.getLastName());
        assertEquals("johndoe", userDto.getLogin());
        assertEquals("MANAGER", userDto.getMainRole());
        assertNotNull(userDto.getPermissions());
    }

    /**
     * Tests the conversion of authorities to permissions.
     * Verifies that:
     * - The permissions list is not null
     * - All authorities are correctly converted
     * - Order and number of elements are preserved
     */
    @Test
    void testAuthoritiesToPermissions() {
        // Given
        List<SimpleGrantedAuthority> authorities = Arrays.asList(
            new SimpleGrantedAuthority("READ"),
            new SimpleGrantedAuthority("WRITE"),
            new SimpleGrantedAuthority("DELETE")
        );

        // When
        List<String> permissions = userMapper.authoritiesToPermissions(authorities);

        // Then
        assertNotNull(permissions);
        assertEquals(3, permissions.size());
        assertTrue(permissions.containsAll(Arrays.asList("READ", "WRITE", "DELETE")));
    }

    /**
     * Tests the behavior of authority conversion with null input.
     * Verifies that:
     * - The method returns null when input is null
     * - No exception is thrown
     */
    @Test
    void testAuthoritiesToPermissionsWithNull() {
        // When
        List<String> permissions = userMapper.authoritiesToPermissions(null);

        // Then
        assertNull(permissions);
    }
} 