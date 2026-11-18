package ch.sectioninformatique.template.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Utility class providing a helper method for executing MockMvc HTTP requests
 * in tests.
 *
 * This class simplifies request execution by:
 * - Accepting a request type as a string (GET, POST, PUT, DELETE)
 * - Setting the Authorization header if a token is provided
 * - Setting the content type (e.g. JSON)
 * - Automatically asserting the expected HTTP status code
 *
 * Used mainly in integration tests with {@link TestControllerTest}.
 */
public class TestControllerHelper {

    /**
     * Performs a MockMvc HTTP request with the specified parameters.
     *
     * @param mockMvc           The MockMvc instance used to execute the request
     * @param requestTypeString The HTTP method ("GET", "POST", "PUT", "DELETE")
     * @param endpoint          The URL path to call (e.g. "/tests/me")
     * @param token             The JWT token for the Authorization header (can be
     *                          null)
     * @param contentType       The content type of the request (e.g.
     *                          MediaType.APPLICATION_JSON)
     * @param expectedStatus    The expected HTTP response status code (e.g. 200)
     * @return ResultActions The result of the request, allowing for further
     *         assertions or documentation
     * @throws Exception
     */
    public static ResultActions performTest(
            MockMvc mockMvc,
            String requestTypeString,
            String endpoint,
            String content,
            String token,
            MediaType contentType,
            int expectedStatus) throws Exception {

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

        return request;
    }

}
