package ch.sectioninformatique.template;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.net.URI;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.operation.OperationRequest;
import org.springframework.restdocs.operation.OperationRequestFactory;
import org.springframework.restdocs.operation.OperationResponse;
import org.springframework.restdocs.operation.OperationResponseFactory;
import org.springframework.restdocs.operation.RequestCookie;
import org.springframework.restdocs.operation.preprocess.OperationPreprocessor;

/**
 * Unit tests for {@link RestDocsSensitiveDataMasking}.
 * Covers the sensitive values produced by template_frontback integration tests
 * (Authorization header, refresh_token cookie, UserDto.token, TokenResponseDto.accessToken).
 */
class RestDocsSensitiveDataMaskingTest {

    private static final String SAMPLE_JWT =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LnVzZXJAdGVzdC5jb20ifQ.signature";

    private final OperationPreprocessor preprocessor = RestDocsSensitiveDataMasking.maskSensitiveData();
    private final OperationRequestFactory requestFactory = new OperationRequestFactory();
    private final OperationResponseFactory responseFactory = new OperationResponseFactory();

    @Test
    void masksAuthorizationBearerHeader() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + SAMPLE_JWT);
        OperationRequest request = requestFactory.create(
                URI.create("http://localhost/users/me"),
                HttpMethod.GET,
                new byte[0],
                headers,
                Collections.emptyList());

        OperationRequest masked = preprocessor.preprocess(request);

        assertEquals("Bearer {access-token}", masked.getHeaders().getFirst("Authorization"));
    }

    @Test
    void masksRefreshTokenCookie() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", "refresh_token=" + SAMPLE_JWT + "; Path=/auth/refresh; HttpOnly");
        OperationRequest request = requestFactory.create(
                URI.create("http://localhost/auth/refresh"),
                HttpMethod.POST,
                new byte[0],
                headers,
                Collections.emptyList());

        OperationRequest masked = preprocessor.preprocess(request);

        assertEquals("refresh_token={refresh-token}; Path=/auth/refresh; HttpOnly",
                masked.getHeaders().getFirst("Cookie"));
    }

    @Test
    void masksTokenFieldsInJsonBody() {
        String body = "{\n  \"token\" : \"" + SAMPLE_JWT + "\",\n"
                + "  \"accessToken\" : \"" + SAMPLE_JWT + "\"\n}";
        OperationResponse response = responseFactory.create(HttpStatus.OK, new HttpHeaders(), body.getBytes());

        OperationResponse masked = preprocessor.preprocess(response);

        String maskedBody = masked.getContentAsString();
        assertEquals("{\n  \"token\" : \"{jwt-access-token}\",\n"
                + "  \"accessToken\" : \"{jwt-access-token}\"\n}", maskedBody);
        assertFalse(maskedBody.contains(SAMPLE_JWT));
    }

    @Test
    void masksRequestCookieCollection() {
        OperationRequest request = requestFactory.create(
                URI.create("http://localhost/auth/refresh"),
                HttpMethod.POST,
                new byte[0],
                new HttpHeaders(),
                Collections.emptyList(),
                List.of(new RequestCookie("refresh_token", SAMPLE_JWT)));

        OperationRequest masked = preprocessor.preprocess(request);

        assertEquals("{refresh-token}", masked.getCookies().iterator().next().getValue());
    }

    @Test
    void keepsMalformedTokenExamplesUsedIn401Tests() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer this.is.not.a.valid.token");
        OperationRequest request = requestFactory.create(
                URI.create("http://localhost/users/me"),
                HttpMethod.GET,
                new byte[0],
                headers,
                Collections.emptyList());

        OperationRequest masked = preprocessor.preprocess(request);

        assertEquals("Bearer this.is.not.a.valid.token", masked.getHeaders().getFirst("Authorization"));
    }
}
