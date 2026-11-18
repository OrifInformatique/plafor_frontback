package ch.sectioninformatique.template.test;

// Import statements for testing, Spring Boot, JSON handling, and REST Docs
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.ResultActions;
import ch.sectioninformatique.template.security.SpringAuthPermissions;
import ch.sectioninformatique.template.AuthApplication;
import ch.sectioninformatique.template.auth.AuthClient;
import ch.sectioninformatique.template.security.UserAuthenticationProvider;
import ch.sectioninformatique.template.user.UserDto;
import ch.sectioninformatique.template.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.restdocs.test.autoconfigure.AutoConfigureRestDocs;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

import org.springframework.transaction.annotation.Transactional;

import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.type.TypeReference;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.http.MediaType;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static ch.sectioninformatique.template.RestDocsSensitiveDataMasking.maskSensitiveData;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessRequest;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import org.springframework.restdocs.snippet.Snippet;

import ch.sectioninformatique.template.RestDocsSnippets;
import org.springframework.security.core.context.SecurityContextHolder;

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
public class TestControllerTest {

    /** Service for handling user-related operations */
    @Autowired
    private UserService userService;

    /** Provider for user authentication and token generation */
    @Autowired
    private UserAuthenticationProvider userAuthenticationProvider;

    /** MockMvc for simulating HTTP requests in tests */
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MessageSource messageSource;

    @MockitoBean
    private AuthClient authClient;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
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

        // Execute the HTTP request using a helper class
        ResultActions request = TestControllerHelper.performTest(
                mockMvc,
                requestTypeString,
                endpoint,
                content,
                token,
                contentType,
                expectedStatus);

        // Execute any additional assertions provided in the lambda
        if (script != null) {
            script.accept(request);
        }

        request.andDo(document("tests/" + docsFileName, preprocessRequest(maskSensitiveData(), prettyPrint()),
                preprocessResponse(maskSensitiveData(), prettyPrint()), snippets));

    }

    private String getMessage(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }

    /**
     * Test: GET /tests/
     *
     * Ensures that an authenticated user can access the test endpoint successfully.
     * Verifies that the API returns a 200 OK status.
     * 
     * @throws Exception
     */
    @Test
    @Transactional // Each test runs in a transaction that rolls back at the end
    public void getHello_withRealData_shouldReturnSuccess() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto));
        performRequest(
                "GET",
                "/tests/",
                null,
                token,
                MediaType.ALL,
                200,
                "get-hello",
                null);
    }

    /**
     * Test: GET /tests/
     *
     * Ensures that an error 401 is thrown in case of missing token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void getHello_missingToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "GET",
                "/tests/",
                null,
                null,
                MediaType.ALL,
                401,
                "get-hello/401/missing-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: GET /tests/
     *
     * Ensures that an error 401 is thrown in case of malformed token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void getHello_withMalformedToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "GET",
                "/tests/",
                null,
                "this.is.not.a.valid.token",
                MediaType.ALL,
                401,
                "get-hello/401/malformed-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message").exists());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: GET /tests/
     *
     * Ensures that an error 401 is thrown in case of expired token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void getHello_withExpiredToken_shouldReturnUnauthorized() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto), Date.from(
                Instant.now().minus(2, ChronoUnit.HOURS)));
        performRequest(
                "GET",
                "/tests/",
                null,
                token,
                MediaType.ALL,
                401,
                "get-hello/401/expired-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("security.jwt.expired")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: GET /tests/me
     *
     * Ensures that the authenticated user can retrieve their own profile details.
     * Verifies that the returned JSON matches expected user attributes.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void me_withRealData_shouldReturnSuccess() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto));
        performRequest(
                "GET",
                "/tests/me",
                null,
                token,
                MediaType.APPLICATION_JSON,
                200,
                "me",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.firstName").value("Test"));
                        request.andExpect(jsonPath("$.lastName").value("User"));
                        request.andExpect(jsonPath("$.login").value("test.user@test.com"));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }

                },
                RestDocsSnippets.userResponse());
    }

    /**
     * Test: GET /tests/me
     *
     * Ensures that an error 401 is thrown in case of missing token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void me_missingToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "GET",
                "/tests/me",
                null,
                null,
                MediaType.APPLICATION_JSON,
                401,
                "me/401/missing-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: GET /tests/me
     *
     * Ensures that an error 401 is thrown in case of malformed token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void me_withMalformedToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "GET",
                "/tests/me",
                null,
                "this.is.not.a.valid.token",
                MediaType.APPLICATION_JSON,
                401,
                "me/401/malformed-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message").exists());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: GET /tests/me
     *
     * Ensures that an error 401 is thrown in case of expired token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void me_withExpiredToken_shouldReturnUnauthorized() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto), Date.from(
                Instant.now().minus(2, ChronoUnit.HOURS)));
        performRequest(
                "GET",
                "/tests/me",
                null,
                token,
                MediaType.APPLICATION_JSON,
                401,
                "me/401/expired-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("security.jwt.expired")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /tests/{id}/promote-test
     *
     * Ensures that an admin user can promote another user to a "test admin" role.
     * Verifies the response contains a "message" field and that the User did get
     * the LOCAL_MANAGER role.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void promoteToTestAdmin_withRealData_shouldReturnSuccess() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        UserDto adminDto = userService.findByLogin("test.admin@test.com");

        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(adminDto));
        performRequest(
                "PUT",
                "/tests/" + userDto.getLogin() + "/promote-test",
                null,
                token,
                MediaType.APPLICATION_JSON,
                200,
                "promote-test",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("user.promoted.local")));

                        UserDto updatedUser = userService.findByLogin("test.user@test.com");

                        assertTrue(updatedUser.getAppSpecificRoles().stream().anyMatch(e -> e == "LOCAL_MANAGER"));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /tests/{userID}/promote-test
     *
     * Ensures that an error 401 is thrown in case of missing token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void promoteToTestAdmin_missingToken_shouldReturnUnauthorized() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        performRequest(
                "PUT",
                "/tests/" + userDto.getId() + "/promote-test",
                null,
                null,
                MediaType.APPLICATION_JSON,
                401,
                "promote-test/401/missing-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /tests/{userID}/promote-test
     *
     * Ensures that an error 401 is thrown in case of malformed token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void promoteToTestAdmin_withMalformedToken_shouldReturnUnauthorized() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        performRequest(
                "PUT",
                "/tests/" + userDto.getId() + "/promote-test",
                null,
                "this.is.not.a.valid.token",
                MediaType.APPLICATION_JSON,
                401,
                "promote-test/401/malformed-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message").exists());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /tests/{userID}/promote-test
     *
     * Ensures that an error 401 is thrown in case of expired token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void promoteToTestAdmin_withExpiredToken_shouldReturnUnauthorized() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        UserDto adminDto = userService.findByLogin("test.admin@test.com");
        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(adminDto), Date.from(
                Instant.now().minus(2, ChronoUnit.HOURS)));
        performRequest(
                "PUT",
                "/tests/" + userDto.getId() + "/promote-test",
                null,
                token,
                MediaType.APPLICATION_JSON,
                401,
                "promote-test/401/expired-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("security.jwt.expired")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /tests/{userID}/promote-test
     *
     * Ensures that an error 403 is thrown in case of non admin demande.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void promoteToTestAdmin_asNonAdmin_shouldReturnForbidden() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto));
        performRequest(
                "PUT",
                "/tests/" + userDto.getId() + "/promote-test",
                null,
                token,
                MediaType.APPLICATION_JSON,
                403,
                "promote-test/403/non-admin",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("error.accessDenied")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test: PUT /tests/{userID}/promote-test
     *
     * Ensures that an error 404 is thrown in case the user to promote isn't found.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void promoteToTestAdmin_userNotFound_shouldReturnNotFound() throws Exception {
        UserDto adminDto = userService.findByLogin("test.admin@test.com");

        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(adminDto));

        String fakeUserId = "9999";

        performRequest(
                "PUT",
                "/tests/" + fakeUserId + "/promote-test",
                null,
                token,
                MediaType.APPLICATION_JSON,
                404,
                "promote-test/404/user-not-found",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("user.notFound")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test case: GET /tests/all
     *
     * Verifies that all users can be retrieved and match expected seeded users.
     * Expects 4 users in the response with specific logins.
     */
    @Test
    @Transactional
    public void all_withRealData_shouldReturnSuccess() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto));
        performRequest(
                "GET",
                "/tests/all",
                null,
                token,
                MediaType.APPLICATION_JSON,
                200,
                "all",
                request -> {
                    try {
                        // Parse response JSON
                        MvcResult result = request.andReturn();
                        String responseBody = result.getResponse().getContentAsString();

                        ObjectMapper mapper = new ObjectMapper();
                        List<Map<String, Object>> users = mapper.readValue(
                                responseBody,
                                new TypeReference<List<Map<String, Object>>>() {
                                });

                        // Verify total number of users
                        assertEquals(4, users.size(), "Should return 4 users");

                        // Verify that all expected logins are present
                        List<String> expectedLogins = List.of(
                                "test.user@test.com",
                                "test.manager@test.com",
                                "test.admin@test.com",
                                "test.admin2@test.com");

                        List<String> returnedLogins = users.stream()
                                .map(user -> (String) user.get("login"))
                                .collect(Collectors.toList());

                        assertTrue(returnedLogins.containsAll(expectedLogins),
                                "Returned users should include all seeded logins");
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test case: GET /tests/all
     *
     * Ensures that an error 401 is thrown in case of missing token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void all_missingToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "GET",
                "/tests/all",
                null,
                null,
                MediaType.APPLICATION_JSON,
                401,
                "all/401/missing-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test case: GET /tests/all
     *
     * Ensures that an error 401 is thrown in case of expired token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void all_withExpiredToken_shouldReturnUnauthorized() throws Exception {
        UserDto userDto = userService.findByLogin("test.user@test.com");

        String token = userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto), Date.from(
                Instant.now().minus(2, ChronoUnit.HOURS)));
        performRequest(
                "GET",
                "/tests/all",
                null,
                token,
                MediaType.APPLICATION_JSON,
                401,
                "all/401/expired-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message")
                                .value(getMessage("security.jwt.expired")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    /**
     * Test case: GET /tests/all
     *
     * Ensures that an error 401 is thrown in case of malformed token.
     * 
     * @throws Exception
     */
    @Test
    @Transactional
    public void all_withMalformedToken_shouldReturnUnauthorized() throws Exception {
        performRequest(
                "GET",
                "/tests/all",
                null,
                "this.is.not.a.valid.token",
                MediaType.APPLICATION_JSON,
                401,
                "all/401/malformed-token",
                request -> {
                    try {
                        request.andExpect(jsonPath("$.message").exists());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

}