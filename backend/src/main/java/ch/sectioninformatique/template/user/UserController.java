package ch.sectioninformatique.template.user;

import java.util.List;
import java.util.Map;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.sectioninformatique.template.app.DeletionFilter;
import ch.sectioninformatique.template.auth.AuthClient;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

/**
 * REST controller for managing user operations.
 * !! Authentication operations are handled in AuthController, this controller focuses on user management !!
 * 
 * This controller handles various user-related endpoints including:
 * - User promotion to different roles
 * - Retrieval of user lists (active, deleted, or all)
 * - User deletion (soft and permanent, local and global)
 * 
 * All endpoints require appropriate authentication and authorization levels.
 */
@RequestMapping("/users")
@RequiredArgsConstructor
@RestController
public class UserController {

    /** Service for handling user-related operations */
    private final UserService userService;

    private final MessageSource messageSource;

    /**
     * Client for making user-related HTTP requests to the authentication service
     */
    private final AuthClient authClient;

    /**
     * Retrieves the currently authenticated user's informations.
     * This endpoint:
     * - Requires user authentication
     * - Returns the user's informations
     * - Is accessible to all authenticated users
     *
     * @return ResponseEntity containing the current user's DTO
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<UserDto> authenticatedUser() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        UserDto currentUser = (UserDto) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    /**
     * Retrieves users in the system, filtered by their soft-delete state.
     * This endpoint:
     * - Requires the 'user:read' authority
     * - Returns only active users by default ({@code ?state=active})
     * - Returns only soft-deleted users with {@code ?state=deleted}
     * - Returns every user with {@code ?state=all}
     * - Is typically used by administrators
     *
     * @param state which subset of users to return (default {@code active})
     * @return ResponseEntity containing the matching list of users
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority('user:read')")
    public ResponseEntity<List<UserDto>> allUsers(
            @RequestParam(defaultValue = "active") DeletionFilter state) {
        List<UserDto> users = switch (state) {
            case ACTIVE -> userService.allUsers();
            case DELETED -> userService.deletedUsers();
            case ALL -> userService.allWithDeletedUsers();
        };
        return ResponseEntity.ok(users);
    }

    /**
     * Handles permanent DELETE requests to "/{userId}/{global}/{hardDelete}"
     * Permanently deletes a user either locally or from the global auth service,
     * based on the 'global' flag
     * If 'global' is false, permanently deletes the user from the local database
     * If 'global' is true, permanently deletes the user from the local database and
     * calls the authClient to permanently delete the user from the auth service
     * Returns a ResponseEntity with success message or error details
     * 
     * @param userId The ID of the user to permanently delete
     * @param global Flag indicating whether to delete locally or globally
     * @param hardDelete A boolean for soft or hard delete (default: false)
     * @return ResponseEntity with permanent deletion result message
     */
    @DeleteMapping("/{userLogin}")
    @PreAuthorize("hasAuthority('user:delete')")
    public Mono<ResponseEntity<?>> deleteUser(@RequestHeader("Authorization") String token,
            @PathVariable String userLogin,
            @RequestParam (required = true) Boolean global,
            @RequestParam (required = true) Boolean hard) {
        // Determine permanent deletion scope based on global flag
        if (global) {
            if (hard){
                return userService.deleteGlobalAndLocalPermanent(token, userLogin)
                        .map(message -> ResponseEntity.ok(Map.of("message", message)));
            }
            else{
                return userService.deleteGlobalAndLocal(token, userLogin)
                        .map(message -> ResponseEntity.ok(Map.of("message", message)));
            }
        } else {
            if (hard){
                // Permanently delete user from local database only
                userService.deleteUserPermanent(userLogin);
                String message = messageSource.getMessage(
                        "user.deleted.local",
                        null,
                        LocaleContextHolder.getLocale());
                return Mono.just(ResponseEntity.ok(Map.of("message", message)));
            }
            else{
                userService.deleteUser(userLogin);
                String message = messageSource.getMessage(
                    "user.deleted.local",
                    null, 
                    LocaleContextHolder.getLocale());
                return Mono.just(ResponseEntity.ok(Map.of("message", message)));
            }
        }
    }

    /**
     * Promotes a user to manager role in both the authentication service and
     * locally.
     * This endpoint:
     * - Requires the 'user:update' authority
     * - First promotes the user in the global auth service
     * - Returns the response from the auth service
     * 
     * @param token  The authorization token (Bearer token) for authentication
     * @param userId The ID of the user to promote to manager role
     * @return Mono containing ResponseEntity with the promotion result
     */
    @PutMapping(path = "/{userLogin}/promote-manager")
    @PreAuthorize("hasAuthority('user:update')")
    public Mono<ResponseEntity<String>> promoteToManager(@RequestHeader("Authorization") String token,
            @PathVariable String userLogin) {
        // Call auth service to promote user to manager globally
        return authClient.promoteToManager(token, userLogin)
                .flatMap(response -> {
                    return Mono.just(response);
                });
    }

    /**
     * Revokes manager role from a user in both the authentication service and
     * locally.
     * This endpoint:
     * - Requires the 'user:update' authority
     * - Revokes the manager role in the global auth service
     * - Returns the response from the auth service
     * 
     * @param token  The authorization token (Bearer token) for authentication
     * @param userId The ID of the user whose manager role will be revoked
     * @return Mono containing ResponseEntity with the revocation result
     */
    @PutMapping(path = "/{userLogin}/revoke-manager")
    @PreAuthorize("hasAuthority('user:update')")
    public Mono<ResponseEntity<String>> revokeManager(@RequestHeader("Authorization") String token,
            @PathVariable String userLogin) {
        // Call auth service to revoke manager role from user globally
        return authClient.revokeManager(token, userLogin)
                .flatMap(response -> {
                    return Mono.just(response);
                });
    }

    /**
     * Promotes a user to admin role in both the authentication service and
     * locally.
     * This endpoint:
     * - Requires the 'user:update' authority
     * - Promotes the user to admin in the global auth service
     * - Returns the response from the auth service
     * 
     * @param token  The authorization token (Bearer token) for authentication
     * @param userId The ID of the user to promote to admin role
     * @return Mono containing ResponseEntity with the promotion result
     */
    @PutMapping(path = "/{userLogin}/promote-admin")
    @PreAuthorize("hasAuthority('user:update')")
    public Mono<ResponseEntity<String>> promoteToAdmin(@RequestHeader("Authorization") String token,
            @PathVariable String userLogin) {
        // Call auth service to promote user to admin globally
        return authClient.promoteToAdmin(token, userLogin)
                .flatMap(response -> {
                    return Mono.just(response);
                });
    }

    /**
     * Revokes admin role from a user in both the authentication service and
     * locally.
     * This endpoint:
     * - Requires the 'user:update' authority
     * - Revokes the admin role in the global auth service
     * - Returns the response from the auth service
     * 
     * @param token  The authorization token (Bearer token) for authentication
     * @param userId The ID of the user whose admin role will be revoked
     * @return Mono containing ResponseEntity with the revocation result
     */
    @PutMapping(path = "/{userLogin}/revoke-admin")
    @PreAuthorize("hasAuthority('user:update')")
    public Mono<ResponseEntity<String>> revokeAdmin(@RequestHeader("Authorization") String token,
            @PathVariable String userLogin) {
        // Call auth service to revoke admin role from user globally
        return authClient.revokeAdmin(token, userLogin)
                .flatMap(response -> {
                    return Mono.just(response);
                });
    }

    /**
     * Downgrades an admin user to manager role in both the authentication service and
     * locally.
     * This endpoint removes admin privileges while maintaining manager-level access.
     * This endpoint:
     * - Requires the 'user:update' authority
     * - Downgrades the admin to manager in the global auth service
     * - Returns the response from the auth service
     * 
     * @param token  The authorization token (Bearer token) for authentication
     * @param userId The ID of the admin user to be downgraded to manager role
     * @return Mono containing ResponseEntity with the downgrade result
     */
    @PutMapping(path = "/{userLogin}/downgrade-admin")
    @PreAuthorize("hasAuthority('user:update')")
    public Mono<ResponseEntity<String>> downgradeAdmin(@RequestHeader("Authorization") String token,
            @PathVariable String userLogin) {

        // Call auth service to downgrade admin to manager globally
        return authClient.downgradeAdmin(token, userLogin)
                .flatMap(response -> {
                    return Mono.just(response);
                });
    }

    /**
     * Promotes a user to the local manager role.
     * This endpoint:
     * - Requires the 'user:update' authority
     * - Validates the user exists and has not already the role
     * - Returns success/error message
     *
     * @param userId The ID of the user to promote
     * @return ResponseEntity with success message or error details
     */
    @PutMapping("/{userLogin}/promote-local-manager-role")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<?> promoteToLocalManagerRole(@PathVariable String userLogin) {
            userService.promoteToLocalManagerRole(userLogin);
            String message = messageSource.getMessage(
                "user.promoted.local",
                null,
                LocaleContextHolder.getLocale());
            return ResponseEntity.ok().body(message);
    }

    /**
     * Updates a user's information.
     * This endpoint:
     * - Requires the 'user:update' authority
     * - Validates the user exists and updates their information
     * - Returns success/error message
     *
     * @param userLogin   The login of the user to update
     * @param user The updated user information
     * @param token The authorization token (Bearer token) for authentication
     * @return ResponseEntity with success message or error details
     */
    @PutMapping("/{userLogin}")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<?> updateUser(@PathVariable String userLogin, @RequestBody UserDto user, @RequestHeader("Authorization") String token ) {

        ResponseEntity<?> reponse = userService.updateUser(userLogin,user, token);
        return reponse;
    }

    /**
     * Restores a soft-deleted user.
     * This endpoint:
     * - Requires the 'user:update' authority
     * - Validates the user exists and is deleted
     * - Returns success/error message
     *
     * @param userLogin The login of the user to restore
     * @param token The authorization token (Bearer token) for authentication
     * @return ResponseEntity with success message or error details
     */
    @PutMapping("/{userLogin}/restore")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<?> restoreUser(@PathVariable String userLogin, @RequestHeader("Authorization") String token) {

        userService.restoreUser(userLogin, token);
        return ResponseEntity.ok().body("User restored successfully.");
    }
}
