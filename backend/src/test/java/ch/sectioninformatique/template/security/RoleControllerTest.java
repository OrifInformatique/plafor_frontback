package ch.sectioninformatique.template.security;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static ch.sectioninformatique.template.RestDocsSensitiveDataMasking.maskSensitiveData;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessRequest;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;

import java.util.function.Consumer;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.restdocs.test.autoconfigure.AutoConfigureRestDocs;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.restdocs.snippet.Snippet;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import ch.sectioninformatique.template.AuthApplication;
import ch.sectioninformatique.template.RestDocsSnippets;
import ch.sectioninformatique.template.user.UserDto;
import ch.sectioninformatique.template.user.UserService;

/**
 * Integration tests for the {@code GET /roles} endpoint, verifying that the
 * {@code ?scope=} query parameter selects local roles, main roles, or both.
 *
 * Snippets generated here feed the REST Docs section for role endpoints.
 */
@SpringBootTest(classes = AuthApplication.class)
@AutoConfigureMockMvc
@AutoConfigureRestDocs(outputDir = "target/generated-snippets")
public class RoleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService;

    @Autowired
    private UserAuthenticationProvider userAuthenticationProvider;

    /** A valid access token for a seeded user (any authenticated user may list roles). */
    private String token() {
        UserDto user = userService.findByLogin("test.user@test.com");
        return userAuthenticationProvider.createToken(SpringAuthPermissions.grant(user));
    }

    private void performRequest(
            String endpoint,
            int expectedStatus,
            String docsFileName,
            Consumer<ResultActions> script,
            Snippet... snippets) throws Exception {
        var request = mockMvc.perform(get(endpoint)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(expectedStatus));

        if (script != null) {
            script.accept(request);
        }

        request.andDo(document("roles/" + docsFileName,
                preprocessRequest(maskSensitiveData(), prettyPrint()),
                preprocessResponse(maskSensitiveData(), prettyPrint()),
                snippets));
    }

    @Test
    public void getRoles_withoutScope_returnsOnlyLocalRoles() throws Exception {
        performRequest(
                "/roles",
                200,
                "local",
                response -> {
                    try {
                        response.andExpect(jsonPath("$[*].type", Matchers.everyItem(Matchers.is("LOCAL"))));
                        response.andExpect(jsonPath("$[*].name", Matchers.hasItem("LOCAL_MANAGER")));
                        response.andExpect(jsonPath("$[*].name", Matchers.not(Matchers.hasItem("ADMIN"))));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.roleListResponse());
    }

    @Test
    public void getRoles_withScopeMain_returnsOnlyMainRoles() throws Exception {
        performRequest(
                "/roles?scope=main",
                200,
                "main",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.length()").value(3));
                        response.andExpect(jsonPath("$[*].type", Matchers.everyItem(Matchers.is("MAIN"))));
                        response.andExpect(jsonPath("$[*].name",
                                Matchers.containsInAnyOrder("USER", "MANAGER", "ADMIN")));
                        response.andExpect(jsonPath("$[*].id", Matchers.everyItem(Matchers.nullValue())));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.roleListResponse());
    }

    @Test
    public void getRoles_withScopeAll_returnsMainAndLocalRoles() throws Exception {
        performRequest(
                "/roles?scope=all",
                200,
                "all",
                response -> {
                    try {
                        response.andExpect(jsonPath("$[*].name", Matchers.hasItem("ADMIN")));
                        response.andExpect(jsonPath("$[*].name", Matchers.hasItem("LOCAL_MANAGER")));
                        response.andExpect(jsonPath("$[*].type", Matchers.hasItems("MAIN", "LOCAL")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.roleListResponse());
    }

    @Test
    public void getRoles_withUnknownScope_returnsBadRequest() throws Exception {
        performRequest(
                "/roles?scope=bogus",
                400,
                "invalid-scope",
                response -> {
                    try {
                        response.andExpect(status().isBadRequest());
                        response.andExpect(jsonPath("$.message").exists());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }
}
