package ch.sectioninformatique.template.item;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static ch.sectioninformatique.template.RestDocsSensitiveDataMasking.maskSensitiveData;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessRequest;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;

import java.util.function.Consumer;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.restdocs.test.autoconfigure.AutoConfigureRestDocs;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.restdocs.snippet.Snippet;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import tools.jackson.databind.ObjectMapper;

import ch.sectioninformatique.template.security.SpringAuthPermissions;
import ch.sectioninformatique.template.AuthApplication;
import ch.sectioninformatique.template.RestDocsSnippets;
import ch.sectioninformatique.template.security.UserAuthenticationProvider;
import ch.sectioninformatique.template.user.User;
import ch.sectioninformatique.template.user.UserDto;
import ch.sectioninformatique.template.user.UserRepository;
import ch.sectioninformatique.template.user.UserService;

/**
 * Integration tests for {@link ItemController} REST endpoints.
 * Snippets generated here feed the REST Docs section for item endpoints.
 */
@SpringBootTest(classes = AuthApplication.class)
@AutoConfigureMockMvc
@AutoConfigureRestDocs(outputDir = "target/generated-snippets")
public class ItemControllerTest {

    private static final String USER_LOGIN = "test.user@test.com";
    private static final String MANAGER_LOGIN = "test.manager@test.com";
    private static final String ADMIN_LOGIN = "test.admin@test.com";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserAuthenticationProvider userAuthenticationProvider;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ObjectMapper objectMapper;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private String tokenFor(String login) {
        UserDto userDto = userService.findByLogin(login);
        if (userDto == null) {
            throw new IllegalStateException("User " + login + " not found. Ensure TestUserSeeder has run.");
        }
        return userAuthenticationProvider.createToken(SpringAuthPermissions.grant(userDto));
    }

    private User userEntity(String login) {
        return userRepository.findByLogin(login).orElseThrow();
    }

    /** Creates a stable item for REST Docs examples. */
    private Item saveDocItem(User author, String name, String description) {
        return itemRepository.save(new Item(name, description, author));
    }

    private void clearItems() {
        itemRepository.deleteAllPermanently();
    }

    private String itemJson(String name, String description) throws Exception {
        return objectMapper.writeValueAsString(
                java.util.Map.of("name", name, "description", description));
    }

    private String getMessage(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }

    private void performRequest(
            String method,
            String endpoint,
            String body,
            String token,
            int expectedStatus,
            String docsFileName,
            Consumer<ResultActions> script,
            Snippet... snippets) throws Exception {

        var builder = switch (method) {
            case "GET" -> get(endpoint);
            case "POST" -> post(endpoint);
            case "PUT" -> put(endpoint);
            case "DELETE" -> delete(endpoint);
            default -> throw new IllegalArgumentException("Unsupported method: " + method);
        };

        if (body != null) {
            builder.content(body);
        }
        if (token != null) {
            builder.header(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        }

        var request = mockMvc.perform(builder.contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(expectedStatus));

        if (script != null) {
            script.accept(request);
        }

        request.andDo(document("items/" + docsFileName,
                preprocessRequest(maskSensitiveData(), prettyPrint()),
                preprocessResponse(maskSensitiveData(), prettyPrint()),
                snippets));
    }

    @Test
    @Transactional
    public void getItems_active_returnsActiveItems() throws Exception {
        clearItems();
        saveDocItem(userEntity(USER_LOGIN), "Doc item", "For REST Docs");

        performRequest(
                "GET",
                "/items",
                null,
                tokenFor(USER_LOGIN),
                200,
                "list-active",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.length()").value(1));
                        response.andExpect(jsonPath("$[0].name").value("Doc item"));
                        response.andExpect(jsonPath("$[0].deleted").value(false));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemsListResponse());
    }

    @Test
    @Transactional
    public void getItems_deleted_returnsSoftDeletedItems() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(MANAGER_LOGIN), "Deleted item", "Soft deleted for REST Docs");
        itemRepository.deleteById(item.getId());

        performRequest(
                "GET",
                "/items?state=deleted",
                null,
                tokenFor(MANAGER_LOGIN),
                200,
                "list-deleted",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.length()").value(1));
                        response.andExpect(jsonPath("$[0].name").value("Deleted item"));
                        response.andExpect(jsonPath("$[0].deleted").value(true));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemsListResponse());
    }

    @Test
    @Transactional
    public void getItems_all_returnsActiveAndDeletedItems() throws Exception {
        clearItems();
        saveDocItem(userEntity(USER_LOGIN), "Active item", "Still visible");
        Item deleted = saveDocItem(userEntity(USER_LOGIN), "Archived item", "Soft deleted");
        itemRepository.deleteById(deleted.getId());

        performRequest(
                "GET",
                "/items?state=all",
                null,
                tokenFor(ADMIN_LOGIN),
                200,
                "list-all",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.length()").value(2));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemsListResponse());
    }

    @Test
    @Transactional
    public void getItems_missingToken_returns401() throws Exception {
        performRequest(
                "GET",
                "/items",
                null,
                null,
                401,
                "list/401/missing-token",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message")
                                .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    @Test
    @Transactional
    public void getItemById_found_returnsItem() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(USER_LOGIN), "Doc item", "For REST Docs");

        performRequest(
                "GET",
                "/items/" + item.getId(),
                null,
                tokenFor(USER_LOGIN),
                200,
                "get-by-id",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.id").value(item.getId()));
                        response.andExpect(jsonPath("$.name").value("Doc item"));
                        response.andExpect(jsonPath("$.author.login").value(USER_LOGIN));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemDetailResponse());
    }

    @Test
    @Transactional
    public void getItemById_notFound_returns404() throws Exception {
        performRequest(
                "GET",
                "/items/999999",
                null,
                tokenFor(USER_LOGIN),
                404,
                "get-by-id/404/not-found",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message").value(getMessage("item.notFound")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    @Test
    @Transactional
    public void getItemById_missingToken_returns401() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(USER_LOGIN), "Doc item", "For REST Docs");

        performRequest(
                "GET",
                "/items/" + item.getId(),
                null,
                null,
                401,
                "get-by-id/401/missing-token",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message")
                                .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    @Test
    @Transactional
    public void createItem_withWritePermission_returnsCreatedItem() throws Exception {
        clearItems();

        performRequest(
                "POST",
                "/items/",
                itemJson("New item", "Created via REST Docs test"),
                tokenFor(MANAGER_LOGIN),
                200,
                "create",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.name").value("New item"));
                        response.andExpect(jsonPath("$.author.login").value(MANAGER_LOGIN));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemCreateRequest(),
                RestDocsSnippets.itemDetailResponse());
    }

    @Test
    @Transactional
    public void createItem_withoutWritePermission_returns403() throws Exception {
        performRequest(
                "POST",
                "/items/",
                itemJson("Forbidden item", "Should not be created"),
                tokenFor(USER_LOGIN),
                403,
                "create/403/forbidden",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message").value(getMessage("error.accessDenied")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    @Test
    @Transactional
    public void createItem_missingToken_returns401() throws Exception {
        performRequest(
                "POST",
                "/items/",
                itemJson("Ghost item", "No authentication"),
                null,
                401,
                "create/401/missing-token",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message")
                                .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemCreateRequest());
    }

    @Test
    @Transactional
    public void updateItem_asAuthor_returnsUpdatedItem() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(MANAGER_LOGIN), "Original name", "Original description");

        performRequest(
                "PUT",
                "/items/" + item.getId(),
                itemJson("Updated name", "Updated description"),
                tokenFor(MANAGER_LOGIN),
                200,
                "update-own",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.name").value("Updated name"));
                        response.andExpect(jsonPath("$.description").value("Updated description"));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemCreateRequest(),
                RestDocsSnippets.itemDetailResponse());
    }

    @Test
    @Transactional
    public void updateItem_asNonAuthor_returns401() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(USER_LOGIN), "User item", "Owned by test user");

        performRequest(
                "PUT",
                "/items/" + item.getId(),
                itemJson("Stolen update", "Not allowed"),
                tokenFor(MANAGER_LOGIN),
                401,
                "update/401/unauthorized",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message").value(getMessage("item.unauthorized")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemCreateRequest());
    }

    @Test
    @Transactional
    public void updateItem_withoutUpdatePermission_returns403() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(MANAGER_LOGIN), "Manager item", "USER cannot update");

        performRequest(
                "PUT",
                "/items/" + item.getId(),
                itemJson("Blocked update", "Not allowed"),
                tokenFor(USER_LOGIN),
                403,
                "update/403/forbidden",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message").value(getMessage("error.accessDenied")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemCreateRequest());
    }

    @Test
    @Transactional
    public void updateItem_notFound_returns404() throws Exception {
        performRequest(
                "PUT",
                "/items/999999",
                itemJson("Missing item", "Does not exist"),
                tokenFor(MANAGER_LOGIN),
                404,
                "update/404/not-found",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message").value(getMessage("item.notFound")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemCreateRequest());
    }

    @Test
    @Transactional
    public void updateItem_missingToken_returns401() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(MANAGER_LOGIN), "Protected item", "Needs auth");

        performRequest(
                "PUT",
                "/items/" + item.getId(),
                itemJson("Anonymous update", "Not allowed"),
                null,
                401,
                "update/401/missing-token",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message")
                                .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                },
                RestDocsSnippets.itemCreateRequest());
    }

    @Test
    @Transactional
    public void deleteItem_asAdmin_softDeletesItem() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(USER_LOGIN), "To delete", "Soft delete via REST Docs");

        performRequest(
                "DELETE",
                "/items/" + item.getId(),
                null,
                tokenFor(ADMIN_LOGIN),
                200,
                "delete-soft",
                null);
    }

    @Test
    @Transactional
    public void deleteItem_asAdmin_permanentlyDeletesItem() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(USER_LOGIN), "Permanent delete", "Removed from database");
        Long itemId = item.getId();

        performRequest(
                "DELETE",
                "/items/" + itemId + "?softDelete=false",
                null,
                tokenFor(ADMIN_LOGIN),
                200,
                "delete-permanent",
                null);
    }

    @Test
    @Transactional
    public void deleteItem_notFound_returns404() throws Exception {
        performRequest(
                "DELETE",
                "/items/999999",
                null,
                tokenFor(ADMIN_LOGIN),
                404,
                "delete/404/not-found",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message").value(getMessage("item.notFound")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    @Test
    @Transactional
    public void deleteItem_missingToken_returns401() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(USER_LOGIN), "Protected item", "Needs auth");

        performRequest(
                "DELETE",
                "/items/" + item.getId(),
                null,
                null,
                401,
                "delete/401/missing-token",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message")
                                .value(getMessage("security.auth.missingOrInvalidToken")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    @Test
    @Transactional
    public void deleteItem_asManager_returns403() throws Exception {
        clearItems();
        Item item = saveDocItem(userEntity(MANAGER_LOGIN), "Protected item", "Manager cannot delete");

        performRequest(
                "DELETE",
                "/items/" + item.getId(),
                null,
                tokenFor(MANAGER_LOGIN),
                403,
                "delete/403/forbidden",
                response -> {
                    try {
                        response.andExpect(jsonPath("$.message").value(getMessage("error.accessDenied")));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }
}
