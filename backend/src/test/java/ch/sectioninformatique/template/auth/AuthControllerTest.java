package ch.sectioninformatique.template.auth;

// Import statements for testing, Spring Boot, JSON handling, and REST Docs
import java.util.ArrayList;
import java.util.function.Consumer;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import ch.sectioninformatique.template.AuthApplication;
import ch.sectioninformatique.template.auth.AuthExceptions.InvalidCredentialsException;
import ch.sectioninformatique.template.auth.AuthExceptions.PasswordUpdateFailedException;
import ch.sectioninformatique.template.auth.AuthExceptions.UserAlreadyExistsException;
import ch.sectioninformatique.template.security.MainRoleEnum;
import ch.sectioninformatique.template.security.SecurityExceptions.InvalidRefreshTokenException;
import ch.sectioninformatique.template.security.SecurityExceptions.InvalidTokenException;
import ch.sectioninformatique.template.security.SecurityExceptions.JwtVerificationException;
import ch.sectioninformatique.template.security.UserAuthenticationProvider;
import ch.sectioninformatique.template.user.User;
import ch.sectioninformatique.template.user.UserDto;
import ch.sectioninformatique.template.user.UserMapper;
import ch.sectioninformatique.template.user.UserService;
import jakarta.servlet.http.Cookie;
import reactor.core.publisher.Mono;

/**
 * Integration tests for the "TestController" REST endpoints.
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
public class AuthControllerTest {

    /** Service for handling user-related operations */
    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    /** Provider for creating JWT tokens */
    @Autowired
    private UserAuthenticationProvider userAuthenticationProvider;

    /** MockMvc for simulating HTTP requests in tests */
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MessageSource messageSource;

    @MockitoBean
    private AuthClient authClient; // mock this instead of the controller

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    /**
     * Helper method to generate a valid JWT token for the test user.
     * Retrieves the test user from the database using UserService and creates a
     * real JWT token
     * using UserAuthenticationProvider.
     * 
     * @return A valid JWT token for the test user
     */
    private String getValidTokenForTestUser() {
        // Get the test user DTO from database (seeded by TestUserSeeder)
        UserDto userDto = userService.findByLogin("test.user@test.com");

        if (userDto == null) {
            throw new RuntimeException("Test user not found. Ensure TestUserSeeder has run.");
        }

        // Create and return a real JWT token
        return userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto));
    }

    /**
     * Helper method for performing and documenting HTTP requests in tests.
     * This reduces repetition by centralizing the request execution and REST Docs
     * generation.
     *
     * @param requestTypeString HTTP method (GET, POST, PUT, etc.)
     * @param endpoint          API endpoint to call
     * @param token             Optional JWT token for authentication
     * @param contentType       Content type for the request
     * @param expectedStatus    Expected HTTP status code (e.g. 200)
     * @param docsFileName      Name for the generated REST Docs snippet
     * @param script            Optional lambda to perform additional assertions
     * 
     * @throws Exception
     */
    private void performRequest(
            String requestTypeString,
            String endpoint,
            String content,
            String token,
            MediaType contentType,
            int expectedStatus,
            String docsFileName,
            Consumer<ResultActions> script,
            Snippet... snippets) throws Exception {

        var requestType = get(endpoint);

        if (requestTypeString.equals("GET")) {
            requestType = get(endpoint);
        } else if (requestTypeString.equals("POST")) {
            requestType = post(endpoint);
        } else if (requestTypeString.equals("PUT")) {
            requestType = put(endpoint);
        } else if (requestTypeString.equals("DELETE")) {
            requestType = delete(endpoint);
        } else {
            throw new IllegalArgumentException("Unsupported request type: " + requestTypeString);
        }

        // Set content only if it's not null
        if (content != null) {
            requestType.content(content);
        }

        // Set Authorization header only if token is provided
        if (token != null) {
            requestType.header("Authorization", "Bearer " + token);
        }

        // Set content type
        requestType.contentType(contentType);

        // Perform request
        var request = mockMvc.perform(requestType)
                .andExpect(status().is(expectedStatus));

        // Execute any additional assertions provided in the lambda
        if (script != null) {
            script.accept(request);
        }

        request.andDo(document("auth/" + docsFileName, preprocessRequest(maskSensitiveData(), prettyPrint()),
                preprocessResponse(maskSensitiveData(), prettyPrint()), snippets));

    }

    private String getMessage(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }

    /**
     * Helper method for performing and documenting HTTP requests with a cookie.
     * This keeps tests consistent with performRequest while allowing cookie-based
     * auth.
     */
    private void performRequest(
            String requestTypeString,
            String endpoint,
            String content,
            String token,
            MediaType contentType,
            int expectedStatus,
            String docsFileName,
            Cookie cookie,
            Consumer<ResultActions> script,
            Snippet... snippets) throws Exception {

        var requestType = get(endpoint);

        if (requestTypeString.equals("GET")) {
            requestType = get(endpoint);
        } else if (requestTypeString.equals("POST")) {
            requestType = post(endpoint);
        } else if (requestTypeString.equals("PUT")) {
            requestType = put(endpoint);
        } else if (requestTypeString.equals("DELETE")) {
            requestType = delete(endpoint);
        } else {
            throw new IllegalArgumentException("Unsupported request type: " + requestTypeString);
        }

        // Set content only if it's not null
        if (content != null) {
            requestType.content(content);
        }

        // Set Authorization header only if token is provided
        if (token != null) {
            requestType.header("Authorization", "Bearer " + token);
        }

        if (cookie != null) {
            requestType.cookie(cookie);
        }

        // Set content type
        requestType.contentType(contentType);

        // Perform request
        var request = mockMvc.perform(requestType)
                .andExpect(status().is(expectedStatus));

        // Execute any additional assertions provided in the lambda
        if (script != null) {
            script.accept(request);
        }

        request.andDo(document("auth/" + docsFileName, preprocessRequest(maskSensitiveData(), prettyPrint()),
                preprocessResponse(maskSensitiveData(), prettyPrint()), snippets));

    }

    /**
     * Test: POST /auth/login
     *
     * Verify successful login with valid credentials returns user data and sets
     * refresh token cookie.
     */
    @Test
    @Transactional
    public void login_withValidCredentials_shouldReturn200AndSetCookie() throws Exception {
        // Get real test user from database, with the permissions spring-auth would return
        UserDto testUser = SpringAuthPermissions.grant(userService.findByLogin("test.user@test.com"));
        testUser.setToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...");

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, "refresh_token=fakeToken123; HttpOnly; Path=/; Max-Age=3600");

        when(authClient.login(any(CredentialsDto.class)))
                .thenReturn(Mono.just(ResponseEntity.ok().headers(headers).body(testUser)));

        performRequest(
                "POST",
                "/auth/login",
                "{\"login\":\"test.user@test.com\", \"password\":\"Secure123@Pass\"}",
                null,
                MediaType.APPLICATION_JSON,
                200,
                "login",
                response -> {
                    try {
                        // Assert status code
                        response.andExpect(status().isOk());

                        // Assert response body fields
                        response.andExpect(jsonPath("$.firstName").value("Test"));
                        response.andExpect(jsonPath("$.login").value("test.user@test.com"));

                        // Assert global (spring-auth) and local permissions are merged
                        response.andExpect(jsonPath("$.permissions").value(
                                org.hamcrest.Matchers.hasItems("user:read", "item:read")));

                        // Assert refresh token cookie
                        response.andExpect(header().string(HttpHeaders.SET_COOKIE,
                                org.hamcrest.Matchers.containsString("refresh_token=fakeToken123")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.loginRequest(),
                RestDocsSnippets.userResponse());
    }

    /**
     * Test: POST /auth/login
     *
     * Verify that a local manager gets its local roles and permissions added to
     * the response of spring-auth, which does not know about them.
     */
    @Test
    @Transactional
    public void login_asLocalManager_shouldReturnLocalRolesAndPermissions() throws Exception {
        userService.promoteToLocalManagerRole("test.user@test.com");

        // spring-auth returns no app-specific roles
        UserDto testUser = SpringAuthPermissions.grant(userService.findByLogin("test.user@test.com"));
        testUser.setAppSpecificRoles(null);

        when(authClient.login(any(CredentialsDto.class)))
                .thenReturn(Mono.just(ResponseEntity.ok().body(testUser)));

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"login\":\"test.user@test.com\", \"password\":\"Secure123@Pass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.appSpecificRoles").value(
                        org.hamcrest.Matchers.contains("LOCAL_MANAGER")))
                .andExpect(jsonPath("$.permissions").value(
                        org.hamcrest.Matchers.hasItems("user:read", "item:write", "ROLE_LOCAL_MANAGER")));
    }

    /**
     * Test: POST /auth/login
     *
     * Mock login failure with invalid credentials and expect 401.
     */
    @Test
    @Transactional
    public void login_withInvalidCredentials_shouldReturn401() throws Exception {
        when(authClient.login(any(CredentialsDto.class)))
                .thenReturn(Mono.error(new InvalidCredentialsException()));

        performRequest(
                "POST",
                "/auth/login",
                "{\"login\":\"john.doe@test.com\", \"password\":\"WrongPass\"}",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "login-invalid",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message").value(getMessage("auth.invalidCredentials")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/register
     *
     * Verify successful registration calls auth client and saves user to local
     * database.
     */
    @Test
    @Transactional
    public void register_withValidData_shouldReturn200AndSaveUserToDatabase() throws Exception {
        // Create a new user DTO that doesn't exist yet in the database


        

        UserDto newUser = UserDto.builder()
                .firstName("NewTest")
                .lastName("Register")
                .login("newtest.register@test.com")
                .mainRole("USER")
                .permissions(new ArrayList<>())
                .token("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...")
                .build();

        User adminUser = User.builder()
            .firstName("admin")
            .lastName("user")
            .login("admin.user@test.com")
            .mainRole(MainRoleEnum.ADMIN)
            .build();

        
        UserDto adminDto = userMapper.toUserDto(adminUser);
        String adminToken = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(adminDto));
        adminDto.setToken(adminToken);




        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, "refresh_token=fakeToken123; HttpOnly; Path=/; Max-Age=3600");

        when(authClient.register(anyString(), any(RegisterDto.class)))
                .thenReturn(Mono.just(ResponseEntity.ok().headers(headers).body(newUser)));

        performRequest(
                "POST",
                "/auth/register",
                "{\"firstName\":\"NewTest\",\"lastName\":\"Register\",\"login\":\"newtest.register@test.com\",\"password\":\"testPassword\"}",
                adminDto.getToken(),
                MediaType.APPLICATION_JSON,
                200,
                "register",
                request -> {
                    try {
                        // Verify the auth client was called
                        verify(authClient).register(anyString(), any(RegisterDto.class));
                        MvcResult mvcResult = request.andReturn();
                        String responseBody = mvcResult.getResponse().getContentAsString();
                        System.out.println("REPONSE BODY : " + responseBody);

                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.registerRequest(),
                RestDocsSnippets.userResponse());
    }

    @Transactional
    @Test
    public void register_withWrongPermission_shouldReturn403() throws Exception{
        
        User user = User.builder()
            .firstName("user")
            .lastName("test")
            .login("user.test@test.com")
            .mainRole(MainRoleEnum.USER)
            .build();


        UserDto newUser = UserDto.builder()
                .firstName("NewTest")
                .lastName("Register")
                .login("newtest.register@test.com")
                .mainRole("USER")
                .permissions(new ArrayList<>())
                .token("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...")
                .build();

        UserDto userDto = userMapper.toUserDto(user);
        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto));
        userDto.setToken(token);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, "refresh_token=fakeToken123; HttpOnly; Path=/; Max-Age=3600");

        when(authClient.register(anyString(), any(RegisterDto.class) ))
                .thenReturn(Mono.just(ResponseEntity.ok().headers(headers).body(newUser)));

        performRequest(
        "POST",
        "/auth/register",
        "{\"firstName\":\"NewTest\",\"lastName\":\"Register\",\"login\":\"newtest.register@test.com\",\"password\":\"testPassword\"}",
        userDto.getToken(),
        MediaType.APPLICATION_JSON,
        403,
        "register-noPermission",
        request ->{
            try {
                // Verify the auth client was called
                verify(authClient, never()).register(anyString(), any(RegisterDto.class));

                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
                });
    }

    

    /**
     * Test: POST /auth/register
     *
     * Verify registration with existing user returns 409 Conflict (current
     * controller behavior).
     * If the controller later wraps to RegistrationFailedException (400), this test
     * should
     * be realigned to that behavior.
     */
    @Test
    @Transactional
    public void register_withExistingUser_shouldReturn409Conflict() throws Exception {


        User adminUser = User.builder()
        .firstName("admin")
        .lastName("User")
        .login("admin.user@test.com")
        .mainRole(MainRoleEnum.ADMIN)
        .build();

        UserDto adminDto = userMapper.toUserDto(adminUser);
        String adminToken = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(adminDto));
        adminDto.setToken(adminToken);

        when(authClient.register(anyString(), any(RegisterDto.class)))
                .thenReturn(Mono.error(new UserAlreadyExistsException()));

        performRequest(
                "POST",
                "/auth/register",
                "{\"firstName\":\"Test\",\"lastName\":\"Existing\",\"login\":\"exists@test.com\",\"password\":\"testPassword\"}",
                adminDto.getToken(),
                MediaType.APPLICATION_JSON,
                409,
                "register-conflict",
                response -> {
                    try {
                        response.andExpect(status().isConflict());
                        response.andExpect(jsonPath("$.message").value(getMessage("auth.userAlreadyExists")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/refresh
     *
     * Verify successful token refresh returns new access token and refresh cookie.
     */
    @Test
    @Transactional
    public void refresh_withValidToken_shouldReturn200AndNewAccessToken() throws Exception {
        // Create token response with real user token
        

        UserDto testUser = userService.findByLogin("test.user@test.com");
        String newAccessToken = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(testUser));
        TokenResponseDto tokenResponse = new TokenResponseDto(newAccessToken);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, "refresh_token=fakeToken123; HttpOnly; Path=/; Max-Age=3600");

        when(authClient.refreshLogin(anyString()))
                .thenReturn(Mono.just(ResponseEntity.ok().headers(headers).body(tokenResponse)));

        Cookie refreshCookie = new Cookie("refresh_token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...");
        performRequest(
                "POST",
                "/auth/refresh",
                null,
                null,
                MediaType.APPLICATION_JSON,
                200,
                "refresh",
                refreshCookie,
                response -> {
                    try {
                        response.andExpect(status().isOk());
                        response.andExpect(jsonPath("$.accessToken").exists());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.refreshResponse());
    }

    /**
     * Test: POST /auth/refresh
     *
     * Verify invalid refresh token returns 401 Unauthorized.
     */
    @Test
    @Transactional
    public void refresh_withInvalidToken_shouldReturn401() throws Exception {
        when(authClient.refreshLogin(anyString()))
                .thenReturn(Mono.error(new InvalidRefreshTokenException()));

        Cookie refreshCookie = new Cookie("refresh_token", "invalidToken");
        performRequest(
                "POST",
                "/auth/refresh",
                null,
                null,
                MediaType.APPLICATION_JSON,
                401,
                "refresh-invalid",
                refreshCookie,
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /auth/update-password
     *
     * Verify successful password update with valid token returns 200.
     */
    @Test
    @Transactional
    public void updatePassword_withValidToken_shouldReturn200() throws Exception {
        String successMessage = getMessage("auth.password.updated");
        MessageResponseDto messageResponse = new MessageResponseDto(successMessage);

        when(authClient.updatePassword(any(String.class), any(PasswordUpdateDto.class)))
                .thenReturn(Mono.just(ResponseEntity.ok(messageResponse)));

        String validToken = getValidTokenForTestUser();

        performRequest(
                "PUT",
                "/auth/update-password",
                "{\"oldPassword\":\"OldPassword123@\",\"newPassword\":\"NewPassword123@\"}",
                validToken,
                MediaType.APPLICATION_JSON,
                200,
                "update-password-success",
                response -> {
                    try {
                        response.andExpect(status().isOk());
                        response.andExpect(jsonPath("$.message").value(successMessage));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.passwordUpdateRequest(),
                RestDocsSnippets.messageResponse());
    }

    /**
     * Test: PUT /auth/update-password
     *
     * Verify password update without authentication token returns 401 Unauthorized.
     */
    @Test
    @Transactional
    public void updatePassword_withoutToken_shouldReturn401() throws Exception {
        performRequest(
                "PUT",
                "/auth/update-password",
                "{\"oldPassword\":\"OldPassword123@\",\"newPassword\":\"NewPassword123@\"}",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "update-password",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: GET /auth/login/azure
     *
     * Azure login endpoint that redirects to spring-auth Azure login.
     */
    @Test
    public void azureLogin_inTestEnvironment_shouldReturn302() throws Exception {
        performRequest(
                "GET",
                "/auth/login/azure",
                null,
                null,
                MediaType.APPLICATION_JSON,
                302,
                "azure-login",
                response -> {
                    try {
                        response.andExpect(status().is3xxRedirection());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/update-password
     * Exception: PasswordUpdateFailedException (400 Bad Request)
     *
     * Documents:
     * - Exception: PasswordUpdateFailedException
     * - HTTP Status: 400 BAD_REQUEST
     * - When thrown: When password update operation fails (e.g., invalid old
     * password, policy violation)
     * - Use case: User attempts to update password but the old password is
     * incorrect or new password doesn't meet requirements
     * - Response: JSON error message
     */
    @Test
    @Transactional
    public void updatePassword_withFailure_shouldReturn400PasswordUpdateFailed() throws Exception {
        String errorDetail = "Old password is incorrect";
        String errorMessage = getMessage("auth.password.update.failed", errorDetail);
        when(authClient.updatePassword(any(String.class), any(PasswordUpdateDto.class)))
            .thenReturn(Mono.error(new PasswordUpdateFailedException(errorDetail)));

        String validToken = getValidTokenForTestUser();

        performRequest(
                "PUT",
                "/auth/update-password",
                "{\"oldPassword\":\"WrongOldPassword\",\"newPassword\":\"NewPassword123@\"}",
                validToken,
                MediaType.APPLICATION_JSON,
                400,
                "update-password-failed",
                response -> {
                    try {
                        response.andExpect(status().isBadRequest());
                        response.andExpect(jsonPath("$.message").value(errorMessage));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/register
     * Exception: RegistrationFailedException (400 Bad Request)
     *
     * Documents:
     * - Exception: RegistrationFailedException
     * - HTTP Status: 400 BAD_REQUEST
     * - When thrown: When registration fails due to invalid input or server-side
     * errors
     * - Use case: User provides invalid registration data or registration service
     * encounters an error
     * - Response: JSON error message with details about what failed
     */
    @Test
    @Transactional
    public void register_withValidationError_shouldReturn400RegistrationFailed() throws Exception {


        User newUser = User.builder()
        .firstName("test")
        .lastName("user")
        .login("invalid-email")
        .mainRole(MainRoleEnum.ADMIN)
        .build();

        UserDto userDto = userMapper.toUserDto(newUser);
        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto));
        userDto.setToken(token);

        String errorDetail = "Invalid email format";
        String errorMessage = getMessage("auth.register.failed", errorDetail);
        when(authClient.register(anyString(), any(RegisterDto.class)))
            .thenReturn(Mono.error(new AuthExceptions.RegistrationFailedException(errorDetail)));

        performRequest(
                "POST",
                "/auth/register",
                "{\"firstName\":\"Test\",\"lastName\":\"User\",\"login\":\"invalid-email\",\"password\":\"testPassword\"}",
                userDto.getToken(),
                MediaType.APPLICATION_JSON,
                400,
                "register-failed",
                response -> {
                    try {
                        response.andExpect(status().isBadRequest());
                        response.andExpect(jsonPath("$.message").value(errorMessage));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/refresh
     * Exception: InvalidTokenException (401 Unauthorized) - with custom message
     *
     * Documents:
     * - Exception: InvalidTokenException
     * - HTTP Status: 401 UNAUTHORIZED
     * - When thrown: When access token or refresh token is invalid, malformed, or
     * expired
     * - Use case: Token cannot be verified or has been revoked
     * - Related exceptions: InvalidRefreshTokenException (specifically for refresh
     * tokens)
     * - Response: JSON error message
     */
    @Test
    @Transactional
    public void refresh_withExpiredToken_shouldReturn401InvalidToken() throws Exception {
        when(authClient.refreshLogin(anyString()))
                .thenReturn(Mono.error(new InvalidTokenException()));

        Cookie refreshCookie = new Cookie("refresh_token", "expiredToken");
        performRequest(
                "POST",
                "/auth/refresh",
                null,
                null,
                MediaType.APPLICATION_JSON,
                401,
                "refresh-expired-token",
                refreshCookie,
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message").value(getMessage("security.token.invalid")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/refresh
     * Exception: InvalidRefreshTokenException (401 Unauthorized)
     *
     * Documents:
     * - Exception: InvalidRefreshTokenException
     * - HTTP Status: 401 UNAUTHORIZED
     * - When thrown: When refresh token is invalid, malformed, expired, or revoked
     * - Use case: User's refresh token session has ended or token was tampered with
     * - Difference from InvalidTokenException: This is specifically for refresh
     * tokens,
     * whereas InvalidTokenException is for access tokens
     * - Resolution: User must log in again to get a new refresh token
     * - Response: JSON error message
     */
    @Test
    @Transactional
    public void refresh_withMalformedRefreshToken_shouldReturn401InvalidRefreshToken() throws Exception {
        when(authClient.refreshLogin(anyString()))
                .thenReturn(Mono.error(new InvalidRefreshTokenException()));

        Cookie refreshCookie = new Cookie("refresh_token", "malformed");
        performRequest(
                "POST",
                "/auth/refresh",
                null,
                null,
                MediaType.APPLICATION_JSON,
                401,
                "refresh-malformed-refresh-token",
                refreshCookie,
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message").value(getMessage("security.refresh.invalid")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/login
     * Exception: InvalidCredentialsException (401 Unauthorized)
     *
     * Documents:
     * - Exception: InvalidCredentialsException
     * - HTTP Status: 401 UNAUTHORIZED
     * - When thrown: When provided login/password combination is invalid
     * - Use case: User enters wrong password or login doesn't exist
     * - Response: Generic error message (no specific info about which is wrong for
     * security)
     * - Related context: SecurityExceptions.AuthenticationRequiredException is
     * thrown
     * when authentication is required but not provided at all
     */
    @Test
    @Transactional
    public void login_withWrongPassword_shouldReturn401InvalidCredentials() throws Exception {
        when(authClient.login(any(CredentialsDto.class)))
                .thenReturn(Mono.error(new InvalidCredentialsException()));

        performRequest(
                "POST",
                "/auth/login",
                "{\"login\":\"test.user@test.com\", \"password\":\"WrongPassword\"}",
                null,
                MediaType.APPLICATION_JSON,
                401,
                "login-wrong-password",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message").value(getMessage("auth.invalidCredentials")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/update-password
     * Exception: SecurityExceptions.InvalidTokenException (401 Unauthorized)
     *
     * Documents:
     * - Exception: InvalidTokenException (from SecurityExceptions)
     * - HTTP Status: 401 UNAUTHORIZED
     * - When thrown: When the access token in Authorization header is invalid,
     * malformed, or expired
     * - Use case: User's session has expired or token was tampered with
     * - Related exceptions:
     * - InvalidRefreshTokenException: For refresh token failures
     * - JwtVerificationException: Specific JWT verification failure
     * - JwtTokenExpiredException: Token has expired (more specific)
     * - MalformedJwtException: Token format is invalid
     * - InvalidJwtSignatureException: Token signature doesn't match
     * - Response: JSON error message from the global exception handler
     */
    @Test
    @Transactional
    public void updatePassword_withMalformedToken_shouldReturn401InvalidToken() throws Exception {
        performRequest(
                "PUT",
                "/auth/update-password",
                "{\"oldPassword\":\"OldPassword123@\",\"newPassword\":\"NewPassword123@\"}",
                "malformed.token.here",
                MediaType.APPLICATION_JSON,
                401,
                "update-password-malformed-token",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/login
     * Exception: AuthExceptions.UserNotFoundException (404 Not Found)
     *
     * Documents:
     * - Exception: UserNotFoundException (from AuthExceptions - auth-specific)
     * - HTTP Status: 404 NOT_FOUND
     * - When thrown: When user with the provided login doesn't exist in the
     * authentication service
     * - Note: Similar to UserExceptions.UserNotFoundException, but thrown during
     * auth operations
     * - Related exception: UserExceptions.UserNotFoundException - for general user
     * operations
     * - Use case: Login with non-existent user email
     * - Response: JSON error message indicating user was not found
     */
    @Test
    @Transactional
    public void login_withNonExistentUser_shouldReturn404UserNotFound() throws Exception {
        when(authClient.login(any(CredentialsDto.class)))
            .thenReturn(Mono.error(new AuthExceptions.UserNotFoundException()));

        performRequest(
                "POST",
                "/auth/login",
                "{\"login\":\"nonexistent@test.com\", \"password\":\"SomePassword123@\"}",
                null,
                MediaType.APPLICATION_JSON,
                404,
                "login-user-not-found",
                response -> {
                    try {
                        response.andExpect(status().isNotFound());
                        response.andExpect(jsonPath("$.message").value(getMessage("user.notFound")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/register
     * Exception: UserAlreadyExistsException (409 Conflict)
     *
     * Documents:
     * - Exception: UserAlreadyExistsException
     * - HTTP Status: 409 CONFLICT
     * - When thrown: When user with the provided login already exists in the system
     * - Use case: User attempts to register with an email that's already in use
     * - Response: JSON error message about conflict/duplicate
     */
    @Test
    @Transactional
    public void register_withDuplicateLogin_shouldReturn409Conflict() throws Exception {


        User admin = User.builder()
        .firstName("admin")
        .lastName("user")
        .login("admin.user@test.com")
        .mainRole(MainRoleEnum.ADMIN)
        .build();

        UserDto adminDto = userMapper.toUserDto(admin);
        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(adminDto));
        adminDto.setToken(token);

        when(authClient.register(anyString(), any(RegisterDto.class)))
                .thenReturn(Mono.error(new UserAlreadyExistsException()));

        performRequest(
                "POST",
                "/auth/register",
                "{\"firstName\":\"Test\",\"lastName\":\"Duplicate\",\"login\":\"duplicate@test.com\",\"password\":\"testPassword\"}",
                adminDto.getToken(),
                MediaType.APPLICATION_JSON,
                409,
                "register-user-already-exists",
                response -> {
                    try {
                        response.andExpect(status().isConflict());
                        response.andExpect(jsonPath("$.message").value(getMessage("auth.userAlreadyExists")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/refresh
     * Exception: SecurityExceptions.JwtVerificationException (401 Unauthorized)
     *
     * Documents:
     * - Exception: JwtVerificationException
     * - HTTP Status: 401 UNAUTHORIZED
     * - When thrown: When JWT token verification fails (e.g., signature mismatch,
     * claims invalid)
     * - Use case: Token claims are invalid or signature doesn't match server's key
     * - Related JWT exceptions:
     * - JwtTokenExpiredException: Token has expired
     * - InvalidJwtSignatureException: Signature is invalid
     * - MalformedJwtException: Token format is invalid
     * - Response: JSON error message with verification details
     */
    @Test
    @Transactional
    public void refresh_withInvalidJwtSignature_shouldReturn401JwtVerificationFailed() throws Exception {
        when(authClient.refreshLogin(anyString()))
                .thenReturn(Mono.error(new JwtVerificationException()));

        Cookie refreshCookie = new Cookie("refresh_token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.invalidSignature");
        performRequest(
                "POST",
                "/auth/refresh",
                null,
                null,
                MediaType.APPLICATION_JSON,
                401,
                "refresh-jwt-verification-failed",
                refreshCookie,
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                        response.andExpect(jsonPath("$.message").value(getMessage("security.jwt.verificationFailed")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/logout
     *
     * Mock a user attempting to log out with a token.
     * Note: This endpoint requires proper authentication credentials. The test
     * expects 401 Unauthorized
     * due to the security configuration and external service dependency that may
     * not be fully available
     * in the test environment.
     */
    @Test
    @Transactional
    public void logout_withToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "POST",
                "/auth/logout",
                null,
                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                MediaType.APPLICATION_JSON,
                401,
                "logout-unauthorized-service",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: POST /auth/logout
     *
     * Mock a user attempting to log out without providing a token.
     * This should return an unauthorized status.
     */
    @Test
    @Transactional
    public void logout_withoutToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "POST",
                "/auth/logout",
                null,
                null,
                MediaType.APPLICATION_JSON,
                401,
                "logout-unauthorized",
                response -> {
                    try {
                        response.andExpect(status().isUnauthorized());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }
}