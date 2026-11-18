package ch.sectioninformatique.template.user;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import org.springframework.security.core.GrantedAuthority;

import ch.sectioninformatique.template.auth.RegisterDto;

/**
 * Mapper interface for converting between User entities and DTOs.
 * This interface uses MapStruct to generate implementation classes for mapping
 * between different user-related objects, including:
 * - User entity to UserDto conversion
 * - RegisterDto to User entity conversion
 * - Authorities to permissions conversion
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * By convention for MapStruct, the interface declares a member INSTANCE,
     * providing clients access to the mapper implementation.
     */
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    /**
     * Converts a User entity to a UserDto.
     * This method:
     * - Maps basic user properties (id, firstName, lastName, login)
     * - Converts the role to a "ROLE_" prefixed string
     * - Converts authorities to a list of permission strings
     * - Ignores the token field (handled separately)
     *
     * @param user The User entity to convert
     * @return A UserDto containing the user's information
     */
    @Mapping(target = "mainRole", expression = "java(user.getMainRole().name())")
    @Mapping(target = "appSpecificRoles", expression = "java(user.getAppSpecificRolesString().stream().sorted().toList())"
)
    @Mapping(target = "permissions", source = "authorities", qualifiedByName = "authoritiesToPermissions")
    @Mapping(target = "token", ignore = true)
    @Mapping(target = "deleted", source = "deleted")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "login", source = "login")
    UserDto toUserDto(User user);

    /**
     * Converts a RegisterDto to a User entity.
     * This method:
     * - Maps basic user properties from the signup data
     * - Ignores  roles (these are handled separately)
     * - Ignores ID and timestamps (these are set by the system)
     *
     * @param RegisterDto The RegisterDto containing user registration data
     * @return A new User entity with the signup information
     */
    @Mapping(target = "mainRole", ignore = true)
    @Mapping(target = "appSpecificRoles", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User signUpToUser(RegisterDto registerDto);

    /**
     * Converts a collection of GrantedAuthority objects to a list of permission
     * strings.
     * This method is used to transform Spring Security authorities into a format
     * suitable for the UserDto.
     *
     * @param authorities Collection of GrantedAuthority objects to convert
     * @return List of permission strings, or null if authorities is null
     */
    @Named("authoritiesToPermissions")
    default List<String> authoritiesToPermissions(Collection<? extends GrantedAuthority> authorities) {
        if (authorities == null)
            return null;
        return authorities.stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.toList());
    }
}