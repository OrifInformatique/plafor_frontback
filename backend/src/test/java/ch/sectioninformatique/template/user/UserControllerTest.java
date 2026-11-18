package ch.sectioninformatique.template.user;

import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.restdocs.test.autoconfigure.AutoConfigureRestDocs;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static ch.sectioninformatique.template.RestDocsSensitiveDataMasking.maskSensitiveData;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessRequest;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import org.springframework.restdocs.snippet.Snippet;

import ch.sectioninformatique.template.security.SpringAuthPermissions;
import ch.sectioninformatique.template.RestDocsSnippets;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import ch.sectioninformatique.template.AuthApplication;
import ch.sectioninformatique.template.auth.AuthClient;
import ch.sectioninformatique.template.auth.RegisterDto;
import ch.sectioninformatique.template.security.UserAuthenticationProvider;
import ch.sectioninformatique.template.user.UserExceptions.UserDeletionException;
import reactor.core.publisher.Mono;

/**
 * Integration tests for the UserController REST endpoints.
 *
 * This class uses Spring Boot's test context to run against a real
 * application context (with database and services), while using MockMvc
 * to simulate HTTP requests and verify API responses.
 *
 * It also integrates Spring REST Docs to automatically generate
 * documentation snippets during test execution.
 */
@SpringBootTest(classes = AuthApplication.class) // Loads the full Spring Boot application context for tests
@AutoConfigureMockMvc // Automatically configures MockMvc for simulating HTTP requests
@AutoConfigureRestDocs(outputDir = "target/generated-snippets") // Configures REST Docs to generate API documentation
public class UserControllerTest {

    /** Service for handling user-related operations */
    @Autowired
    private UserService userService;

    /** MockMvc for simulating HTTP requests in tests */
    @Autowired
    private MockMvc mockMvc;

    /** Provider for creating JWT tokens */
    @Autowired
    private UserAuthenticationProvider userAuthenticationProvider;

    /** User repository to verify persistence side-effects */
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageSource messageSource;

    /**
     * Mock client for external auth service (only used for global delete
     * operations)
     */
    @MockitoBean
    private AuthClient authClient;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    /**
     * Helper method to generate a valid JWT token for a test user by login.
     * Retrieves the user from the database using UserService and creates a real JWT
     * token
     * using UserAuthenticationProvider.
     * 
     * @param login The login email of the user to generate a token for
     * @return A valid JWT token for the specified user
     */
    private String getValidTokenForUser(String login) {
        // Get the user DTO from database (seeded by TestUserSeeder)
        UserDto userDto = userService.findByLogin(login);

        if (userDto == null) {
            throw new RuntimeException("User " + login + " not found. Ensure TestUserSeeder has run.");
        }

        // Create and return a real JWT token
        return userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto));
    }

    private String getMessage(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }

    private UserDto createTemporaryUser() {
        String uniqueLogin = "temp.permanent." + System.currentTimeMillis() + "@test.com";
        userService.register(new RegisterDto("Temp", "User", uniqueLogin, null, null, null));
        return userService.findByLogin(uniqueLogin);
    }

    /**
     * Helper method for performing and documenting HTTP requests in tests.
     * This reduces repetition by centralizing the request execution and REST Docs
     * generation.
     *
     * @param requestTypeString HTTP method (GET, POST, PUT, DELETE, etc.)
     * @param endpoint          API endpoint to call
     * @param token             Optional JWT token for authentication
     * @param contentType       Content type for the request
     * @param expectedStatus    Expected HTTP status code (e.g. 200)
     * @param docsFileName      Name for the generated REST Docs snippet
     * @param handleAsync       Whether to handle async request/response
     * @param script            Optional lambda to perform additional assertions
     * 
     * @throws Exception
     */
    private void performRequest(
            String requestTypeString,
            String endpoint,
            String token,
            MediaType contentType,
            int expectedStatus,
            String docsFileName,
            boolean handleAsync,
            Consumer<ResultActions> script,
            Snippet... snippets) throws Exception {

        var request = get(endpoint);
        if ("GET".equals(requestTypeString)) {
            request = get(endpoint);
        } else if ("DELETE".equals(requestTypeString)) {
            request = delete(endpoint);
        } else if ("PUT".equals(requestTypeString)) {
            request = put(endpoint);
        } else {
            throw new IllegalArgumentException("Unsupported request type: " + requestTypeString);
        }

        if (token != null) {
            request.header(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        }

        request.contentType(contentType);

        var result = mockMvc.perform(request);

        if (handleAsync) {
            result.andExpect(request().asyncStarted());
            var mvcResult = result.andReturn();
            result = mockMvc.perform(asyncDispatch(mvcResult));
        }

        result.andExpect(status().is(expectedStatus));

        if (script != null) {
            script.accept(result);
        }

        result.andDo(document("users/" + docsFileName, preprocessRequest(maskSensitiveData(), prettyPrint()),
                preprocessResponse(maskSensitiveData(), prettyPrint()), snippets));
    }

    /**
     * Overloaded helper for non-async requests (backward compatibility)
     */
    private void performRequest(
        String requestTypeString,
        String endpoint,
        String token,
        MediaType contentType,
        int expectedStatus,
        String docsFileName,
        Consumer<ResultActions> script,
        Snippet... snippets) throws Exception {

            performRequest(requestTypeString, endpoint, token, contentType, expectedStatus, docsFileName, false, script, snippets);
    }

    // ==================== GET /users/me ====================

    /**
     * Test: GET /users/me - Success
     *
     * Test retrieving the current authenticated user with a valid token.
     */
    @Test
    public void me_withToken_shouldReturnSuccess() throws Exception {
        String validToken = getValidTokenForUser("test.user@test.com");
        performRequest(
            "GET",
            "/users/me",
            validToken,
            MediaType.APPLICATION_JSON,
            200,
            "me-success",
            response -> {
                try {
                    response.andExpect(status().isOk());
                    response.andExpect(jsonPath("$.login")
                        .value("test.user@test.com"));
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            },
            RestDocsSnippets.userResponse());
    }

    /**
     * Test: GET /users/me - 401 Unauthorized
     *
     * Test retrieving the current authenticated user without a token.
     */
    @Test
    public void me_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
            "GET",
            "/users/me",
            null,
            MediaType.APPLICATION_JSON,
            401,
            "me-unauthorized-missing-token",
            response -> {
                try {
                    response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
    }

    // ==================== GET /users ====================

    /**
     * Test: GET /users?state=active - Success
     *
     * Test retrieving active users with proper authorization.
     */
    @Test
    public void allUsers_withToken_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        performRequest(
            "GET",
            "/users?state=active",
            adminToken,
            MediaType.APPLICATION_JSON,
            200,
            "all-users-success",
            response -> {
                try {
                    response.andExpect(status().isOk());
                    response.andExpect(jsonPath("$").isArray());
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * Test: GET /users?state=active
     *
     * Verify users with user:read authority can retrieve the user list.
     */
    @Test
    @Transactional
    public void allUsers_withReadAuthority_shouldReturn200AndUserList() throws Exception {
        String validToken = getValidTokenForUser("test.user@test.com");

        performRequest(
            "GET",
            "/users?state=active",
            validToken,
            MediaType.APPLICATION_JSON,
            200,
            "all-users",
            response -> {
                try {
                    // Verify response is an array
                    response.andExpect(jsonPath("$").isArray());
                    // Verify at least the test users exist
                    response.andExpect(jsonPath("$[?(@.login == 'test.user@test.com')]").exists());
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            },
            RestDocsSnippets.userListResponse());
    }

    /**
     * Test: GET /users - 401 Unauthorized
     *
     * Test retrieving all users without proper authorization.
     */
    @Test
    public void allUsers_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "GET",
                "/users",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "all-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== GET /users?state=all ====================

    /**
     * Test: GET /users?state=all - Success
     *
     * Test retrieving all users including soft-deleted ones with proper authorization.
     */
    @Test
    public void allWithDeletedUsers_withToken_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        performRequest(
                "GET",
                "/users?state=all",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "all-with-deleted-success",
                response -> {
                    try {
                        response.andExpect(status().isOk());
                        response.andExpect(jsonPath("$").isArray());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }
    /**
     * Test: DELETE /users/{id}/false
     *
     * Verify local user deletion removes or flags the user deleted without calling
     * external auth service.
     */
    @Test
    @Transactional
    public void deleteLocalUser_withoutGlobalFlag_shouldReture200() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        // Get a different test user to delete (not the admin performing the deletion)
        UserDto userToDelete = userService.findByLogin("test.user@test.com");
        assertNotNull(userToDelete, "Test user should exist");

        performRequest(
                "DELETE",
                "/users/" + userToDelete.getLogin() + "?global=false&hard=false",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "delete-local-success",
                true,
                response -> {
                    try {
                        response.andDo(print());
                        response.andExpect(status().isOk());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("user.deleted.local")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });

        // Verify DB side effect (soft or hard delete) and no call to external auth service
        assertUserDeleted(userToDelete);
        verifyNoInteractions(authClient);
    }

    /**
     * Test: DELETE /users/{id}/true
     *
     * Verify global user deletion calls external auth service and removes from
     * database.
     */
    @Test
    @Transactional
    public void deleteGlobalUser_withGlobalFlag_shouldCallAuthServiceAndDeleteFromDatabase() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        // Get a test admin2 user to delete
        UserDto admin2User = userService.findByLogin("test.admin2@test.com");
        assertNotNull(admin2User, "Test admin2 user should exist");

        // Mock the external auth service response
        Map<String, String> authServiceResponse = Map.of(
                "deletedUserLogin", "test.admin2@test.com",
                "message", "User deleted from auth service");
        when(authClient.deleteGlobalUser(eq("Bearer " + adminToken), eq(admin2User.getLogin())))
                .thenReturn(Mono.just(ResponseEntity.ok(authServiceResponse)));

        performRequest(
                "DELETE",
                "/users/" + admin2User.getLogin() + "?global=true&hard=false",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "delete-global",
                true,
                null);

        // Verify the auth client was called
        verify(authClient).deleteGlobalUser(eq("Bearer " + adminToken), eq(admin2User.getLogin()));
        // Verify DB side effect (soft or hard delete)
        assertUserDeleted(admin2User);
    }

    /**
     * Assert the user is either absent (hard delete) or marked as deleted (soft delete).
     */
    private void assertUserDeleted(UserDto userDto) {
        Optional<User> deleted = userRepository.findByLogin(userDto.getLogin());
        boolean removedOrFlagged = deleted.isEmpty() || deleted.map(User::isDeleted).orElse(false);
        assertTrue(removedOrFlagged, "User should be removed or flagged as deleted in the database");
    }

    /**
     * Test: DELETE /users/{id}/true
     *
     * Verify error handling when global user deletion fails in external auth
     * service.
     */
    @Test
    @Transactional
    public void deleteGlobalUser_whenAuthServiceFails_shouldPropagateError() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        // Get a test manager user
        UserDto managerUser = userService.findByLogin("test.manager@test.com");
        assertNotNull(managerUser, "Test manager user should exist");

        // Mock the external auth service to return an error
        when(authClient.deleteGlobalUser(eq("Bearer " + adminToken), eq(managerUser.getLogin())))
                .thenReturn(Mono.error(new UserDeletionException("Failed to delete user from auth service")));

        performRequest(
                "DELETE",
                "/users/" + managerUser.getLogin() + "?global=true&hard=false",
                adminToken,
                MediaType.APPLICATION_JSON,
                400,
                "delete-global-error",
                true,
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message").value(
                                getMessage("user.delete.failed", "Failed to delete user from auth service")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /users/{userId}/promote-local-manager-role
     * Exception: UserPromotionException (400 Bad Request)
     *
     * Documents:
     * - Exception: UserPromotionException
     * - HTTP Status: 400 BAD_REQUEST
     * - When thrown: When user promotion to a role fails (e.g., database error,
     * invalid state)
     * - Use case: Administrator attempts to promote a user but the operation fails
     * - Related exception: UserAlreadyHasRoleException - When user already has the
     * target role
     * - Response: JSON error message with details about promotion failure
     */
    @Test
    @Transactional
    public void promoteLocalAppRole_withValidUser_shouldReturn200Success() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToPromote = userService.findByLogin("test.user@test.com");
        assertNotNull(userToPromote, "Test user should exist");

        performRequest(
                "PUT",
                "/users/" + userToPromote.getLogin() + "/promote-local-manager-role",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "promote-role-success",
                null);
    }

    /**
     * Test: PUT /users/{userId}/promote-local-manager-role
     * Exception: UserAlreadyHasRoleException (409 Conflict)
     *
     * Documents:
     * - Exception: UserAlreadyHasRoleException
     * - HTTP Status: 409 CONFLICT
     * - When thrown: When attempting to promote a user to a role they already have
     * - Use case: Administrator tries to promote a user to LOCAL_MANAGER but they
     * already have it
     * - Related exception: UserPromotionException - General promotion failures
     * - Response: JSON error message indicating role conflict
     */
    @Test
    @Transactional
    public void promoteLocalAppRole_withAlreadyHasRole_shouldReturn409Conflict() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToPromote = userService.findByLogin("test.user@test.com");
        assertNotNull(userToPromote, "Test user should exist");

        // First promotion should succeed
        performRequest(
                "PUT",
                "/users/" + userToPromote.getLogin() + "/promote-local-manager-role",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "promote-role-success-temp",
                null);

        // Refresh user from database to get updated roles
        userToPromote = userService.findByLogin("test.user@test.com");

        // Second promotion attempt should fail with 409 Conflict
        performRequest(
                "PUT",
                "/users/" + userToPromote.getLogin() + "/promote-local-manager-role",
                adminToken,
                MediaType.APPLICATION_JSON,
                409,
                "promote-role-already-exists",
                null);
    }

    /**
     * Test: DELETE /users/{userId}/{global}
     * Exception: UserDeletionException (400 Bad Request)
     *
     * Documents:
     * - Exception: UserDeletionException
     * - HTTP Status: 400 BAD_REQUEST
     * - When thrown: When user deletion operation fails (e.g., database error,
     * referential constraints)
     * - Use case: Administrator attempts to delete a user but operation fails at
     * service level
     * - Related exceptions:
     * - UserAlreadyDeletedException: User was already deleted
     * - PermanentUserDeletionException: Permanent deletion fails
     * - Response: JSON error message with details about deletion failure
     * - Note: LocalUserDeletion vs GlobalUserDeletion both can throw this
     */
    @Test
    @Transactional
    public void deleteUser_withDeletionFailure_shouldReturn400UserDeletionFailed() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToDelete = userService.findByLogin("test.manager@test.com");
        assertNotNull(userToDelete, "Test manager user should exist");

        // Mock auth client to return error for global delete
        when(authClient.deleteGlobalUser(any(String.class), any(String.class)))
            .thenReturn(Mono.error(new UserDeletionException("Database constraint violation")));

        performRequest(
                "DELETE",
                "/users/" + userToDelete.getLogin() + "?global=true&hard=false",
                adminToken,
                MediaType.APPLICATION_JSON,
                400,
                "delete-user-deletion-failed",
                true,
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message").value(
                                getMessage("user.delete.failed", "Database constraint violation")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: DELETE /users/{userId}/{global}
     * Exception: UserNotFoundException (404 Not Found)
     *
     * Documents:
     * - Exception: UserNotFoundException (from UserExceptions)
     * - HTTP Status: 404 NOT_FOUND
     * - When thrown: When querying or operating on a user that doesn't exist
     * - Use case: Administrator tries to delete a user with invalid ID
     * - Related exception: UserNotFoundByLoginException - For finding by login
     * - Note: Different from AuthExceptions.UserNotFoundException which is auth-specific
     * - Response: JSON error message indicating user was not found
     */
    @Test
    @Transactional
    public void deleteUser_withNonExistentId_shouldReturn404UserNotFound() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        String nonExistentUserLogin = "Non-login";

        performRequest(
                "DELETE",
                "/users/" + nonExistentUserLogin + "?global=false&hard=false",
                adminToken,
                MediaType.APPLICATION_JSON,
                404,
                "delete-user-not-found",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message").value(getMessage("user.notFound")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }
    
    /**
     * Test: Any protected endpoint (e.g., GET /users?state=active)
     * Exception: SecurityExceptions.AuthenticationRequiredException (401
     * Unauthorized)
     *
     * Documents:
     * - Exception: AuthenticationRequiredException (from SecurityExceptions)
     * - HTTP Status: 401 UNAUTHORIZED
     * - When thrown: When authentication is required but not provided
     * - Use case: User tries to access protected endpoint without authorization
     * header or token
     * - Related exceptions:
     * - MissingAuthorizationHeaderException: Authorization header is absent
     * - InvalidAuthorizationHeaderException: Header format is incorrect
     * - InvalidTokenException: Token is invalid/expired
     * - Response: JSON error message from UserAuthenticationEntryPoint
     */
    @Test
    @Transactional
    public void allUsers_withoutAuthentication_shouldReturn401Unauthorized() throws Exception {
        performRequest(
                "GET",
                "/users?state=active",
                null, // No token
                MediaType.APPLICATION_JSON,
                401,
                "users-all-unauthorized",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: GET /users?state=all - 401 Unauthorized
     *
     * Test retrieving all users including soft-deleted ones without proper authorization.
     */
    @Test
    public void allWithDeletedUsers_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "GET",
                "/users?state=all",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "all-with-deleted-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== GET /users?state=deleted ====================

    /**
     * Test: GET /users?state=deleted - Success
     *
     * Test retrieving only soft-deleted users with proper authorization.
     */
    @Test
    public void deletedUsers_withToken_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        performRequest(
                "GET",
                "/users?state=deleted",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "deleted-users-success",
                response -> {
                    try {
                        response.andExpect(status().isOk());
                        response.andExpect(jsonPath("$").isArray());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: GET /users?state=deleted - 401 Unauthorized
     *
     * Test retrieving only soft-deleted users without proper authorization.
     */
    @Test
    public void deletedUsers_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "GET",
                "/users?state=deleted",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "deleted-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: GET /users?state=bogus - 400 Bad Request
     *
     * An unknown value for the {@code state} filter is rejected with a
     * standardized error body.
     */
    @Test
    public void listUsers_withUnknownState_shouldReturnBadRequest() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        performRequest(
                "GET",
                "/users?state=bogus",
                adminToken,
                MediaType.APPLICATION_JSON,
                400,
                "list-invalid-state",
                response -> {
                    try {
                        response.andExpect(status().isBadRequest());
                        response.andExpect(jsonPath("$.message").exists());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== PUT /users/{userId}/promote-local-manager-role ====================

    /**
     * Test: PUT /users/{userId}/promote-local-manager-role - 401 Unauthorized
     *
     * Test promoting a user to local app role without proper authorization.
     */
    @Test
    public void promoteToLocalManagerRole_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "PUT",
                "/users/1/promote-local-manager-role",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "promote-local-manager-role-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== DELETE /users/{userId}/{global} - Local ====================

    /**
     * Test: DELETE /users/{userId}/{global} - Local 401 Unauthorized
     *
     * Test soft deleting a user locally without authorization.
     */
    @Test
    @Transactional
    public void deleteUser_locallyWithoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "DELETE",
                "/users/test.user@test.com?global=false&hard=false",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "delete-local-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== DELETE /users/{userId}/{global} - Global ====================

    /**
     * Test: DELETE /users/{userId}/{global} - Global Success with Mocked WebClient
     *
     * Test soft deleting a user globally with mocked webclient response.
     */
    @Test
    @Transactional
    public void deleteUser_globally_withMockedWebClient_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToDelete = userService.findByLogin("test.user@test.com");
        assertNotNull(userToDelete, "Test user should exist");
        Map<String, String> mockedResponse = Map.of(
                "message", "User deleted successfully",
            "deletedUserLogin", userToDelete.getLogin());

        when(authClient.deleteGlobalUser(anyString(), anyString()))
                .thenReturn(Mono.just(ResponseEntity.ok(mockedResponse)));

        performRequest(
                "DELETE",
            "/users/" + userToDelete.getLogin() + "?global=true&hard=false",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "delete-global-success",
                true,
                response -> {
                    try {
                        response.andExpect(status().isOk());
                        response.andExpect(jsonPath("$.message")
                            .value("User deleted successfully"));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: DELETE /users/{userId}/{global} - Global 401 Unauthorized
     *
     * Test soft deleting a user globally without authorization.
     */
    @Test
    @Transactional
    public void deleteUser_globallyWithoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "DELETE",
                "/users/2/true",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "delete-global-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== DELETE /users/{userId}/{global}/permanent - Local ====================

    /**
     * Test: DELETE /users/{userId}/{global}/permanent - Local Success
     *
     * Test permanently deleting a user locally with proper authorization.
     */
    @Test
    @Transactional
    public void deleteUserPermanent_locally_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToDelete = createTemporaryUser();
        assertNotNull(userToDelete, "Temporary user should exist");
        performRequest(
                "DELETE",
                "/users/" + userToDelete.getLogin() + "?global=false&hard=true",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "delete-permanent-local-success",
                true, // Controller returns Mono, so MockMvc must async-dispatch to get the JSON body.
                response -> {
                    try {
                        response.andDo(print());
                        response.andExpect(status().isOk());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("user.deleted.local")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: DELETE /users/{userId}/{global}/permanent - Local 401 Unauthorized
     *
     * Test permanently deleting a user locally without proper authorization.
     */
    @Test
    public void deleteUserPermanent_locallyWithoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "DELETE",
                "/users//false/permanent",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "delete-permanent-local-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== DELETE /users/{userId}/{global}/permanent - Global ====================

    /**
     * Test: DELETE /users/{userId}/{global}/permanent - Global Success with Mocked WebClient
     *
     * Test permanently deleting a user globally with mocked webclient response.
     */
    @Test
    @Transactional
    public void deleteUserPermanent_globally_withMockedWebClient_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToDelete = createTemporaryUser();
        assertNotNull(userToDelete, "Temporary user should exist");
        Map<String, String> mockedResponse = Map.of(
                "message", "User deleted permanently",
            "deletedUserLogin", userToDelete.getLogin());

        when(authClient.deleteGlobalUserPermanent(anyString(), anyString()))
                .thenReturn(Mono.just(ResponseEntity.ok(mockedResponse)));

        performRequest(
                "DELETE",
            "/users/" + userToDelete.getLogin() + "?global=true&hard=true",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "delete-permanent-global-success",
                true,
                response -> {
                    try {
                        response.andDo(print());
                        response.andExpect(status().isOk());
                        response.andExpect(jsonPath("$.message")
                            .value("User deleted permanently"));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: DELETE /users/{userId}/{global}/permanent - Global 401 Unauthorized
     *
     * Test permanently deleting a user globally without authorization.
     */
    @Test
    @Transactional
    public void deleteUserPermanent_globallyWithoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "DELETE",
                "/users/2/true/permanent",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "delete-permanent-global-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== PUT /users/{userId}/promote-manager ====================

    /**
     * Test: PUT /users/{userId}/promote-manager - Success with Mocked WebClient
     *
     * Test promoting a user to manager role with mocked webclient response.
     */
    @Test
    @Transactional
    public void promoteToManager_withMockedWebClient_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToPromote = userService.findByLogin("test.user@test.com");
        assertNotNull(userToPromote, "Test user should exist");
        when(authClient.promoteToManager(anyString(), anyString()))
                .thenReturn(Mono.just(ResponseEntity.ok("User promoted to manager successfully")));

        performRequest(
                "PUT",
            "/users/" + userToPromote.getLogin() + "/promote-manager",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "promote-manager-success",
                true,
                response -> {
                    try {
                        response.andExpect(status().isOk());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /users/{userId}/promote-manager - 401 Unauthorized
     *
     * Test promoting a user to manager role without authorization.
     */
    @Test
    @Transactional
    public void promoteToManager_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "PUT",
                "/users/test.user@test.com/promote-manager",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "promote-manager-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== PUT /users/{userId}/revoke-manager ====================

    /**
     * Test: PUT /users/{userId}/revoke-manager - Success with Mocked WebClient
     *
     * Test revoking manager role with mocked webclient response.
     */
    @Test
    @Transactional
    public void revokeManager_withMockedWebClient_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToRevoke = userService.findByLogin("test.manager@test.com");
        assertNotNull(userToRevoke, "Test manager user should exist");
        when(authClient.revokeManager(anyString(), anyString()))
                .thenReturn(Mono.just(ResponseEntity.ok("Manager role revoked successfully")));

        performRequest(
                "PUT",
            "/users/" + userToRevoke.getLogin() + "/revoke-manager",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "revoke-manager-success",
                true,
                response -> {
                    try {
                        response.andExpect(status().isOk());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /users/{userId}/revoke-manager - 401 Unauthorized
     *
     * Test revoking manager role from a user without authorization.
     */
    @Test
    @Transactional
    public void revokeManager_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "PUT",
                "/users/test.user@test.com/revoke-manager",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "revoke-manager-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== PUT /users/{userId}/promote-admin ====================

    /**
     * Test: PUT /users/{userId}/promote-admin - Success with Mocked WebClient
     *
     * Test promoting a user to admin role with mocked webclient response.
     */
    @Test
    @Transactional
    public void promoteToAdmin_withMockedWebClient_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToPromote = userService.findByLogin("test.manager@test.com");
        assertNotNull(userToPromote, "Test manager user should exist");
        when(authClient.promoteToAdmin(anyString(), anyString()))
                .thenReturn(Mono.just(ResponseEntity.ok("Admin role assigned successfully")));

        performRequest(
                "PUT",
            "/users/" + userToPromote.getLogin() + "/promote-admin",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "promote-admin-success",
                true,
                response -> {
                    try {
                        response.andExpect(status().isOk());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /users/{userId}/promote-admin - 401 Unauthorized
     *
     * Test promoting a user to admin role without authorization.
     */
    @Test
    @Transactional
    public void promoteToAdmin_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "PUT",
                "/users/test.user@test.com/promote-admin",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "promote-admin-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== PUT /users/{userId}/revoke-admin ====================

    /**
     * Test: PUT /users/{userId}/revoke-admin - Success with Mocked WebClient
     *
     * Test revoking admin role with mocked webclient response.
     */
    @Test
    @Transactional
    public void revokeAdmin_withMockedWebClient_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToRevoke = userService.findByLogin("test.admin2@test.com");
        assertNotNull(userToRevoke, "Test admin2 user should exist");
        when(authClient.revokeAdmin(anyString(), anyString()))
                .thenReturn(Mono.just(ResponseEntity.ok("Admin role revoked successfully")));

        performRequest(
                "PUT",
            "/users/" + userToRevoke.getLogin() + "/revoke-admin",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "revoke-admin-success",
                true,
                response -> {
                    try {
                        response.andExpect(status().isOk());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /users/{userId}/revoke-admin - 401 Unauthorized
     *
     * Test revoking admin role from a user without authorization.
     */
    @Test
    @Transactional
    public void revokeAdmin_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "PUT",
                "/users/1/revoke-admin",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "revoke-admin-unauthorized-missing-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                            .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    // ==================== PUT /users/{userId}/downgrade-admin ====================

    /**
     * Test: PUT /users/{userId}/downgrade-admin - Success with Mocked WebClient
     *
     * Test downgrading admin to manager with mocked webclient response.
     */
    @Test
    @Transactional
    public void downgradeAdmin_withMockedWebClient_shouldReturnSuccess() throws Exception {
        String adminToken = getValidTokenForUser("test.admin@test.com");
        UserDto userToDowngrade = userService.findByLogin("test.admin2@test.com");
        assertNotNull(userToDowngrade, "Test admin2 user should exist");
        when(authClient.downgradeAdmin(anyString(), anyString()))
                .thenReturn(Mono.just(ResponseEntity.ok("Admin role downgraded successfully")));

        performRequest(
                "PUT",
            "/users/" + userToDowngrade.getLogin() + "/downgrade-admin",
                adminToken,
                MediaType.APPLICATION_JSON,
                200,
                "downgrade-admin-success",
                true,
                response -> {
                    try {
                        response.andExpect(status().isOk());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /users/{userId}/downgrade-admin - 401 Unauthorized
     *
     * Test downgrading an admin to manager role without authorization.
     */
    @Test
    @Transactional
    public void downgradeAdmin_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "PUT",
                "/users/test.admin@test.com/downgrade-admin",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "downgrade-admin-unauthorized",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message")
                                .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }
    
    /**
     * Test: DELETE /users/{userId}/{global} without delete authority should return 403.
     */
    @Test
    @Transactional
    public void deleteUser_withInsufficientAuthority_shouldReturn403Forbidden() throws Exception {
        String userToken = getValidTokenForUser("test.user@test.com");
        UserDto targetUser = userService.findByLogin("test.manager@test.com");
        assertNotNull(targetUser, "Target user should exist");

        performRequest(
                "DELETE",
                "/users/" + targetUser.getLogin() + "?global=false&hard=false",
                userToken,
                MediaType.APPLICATION_JSON,
                403,
                "delete-forbidden",
                null);
    }
}
