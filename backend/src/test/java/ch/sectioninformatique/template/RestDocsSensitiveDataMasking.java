package ch.sectioninformatique.template;

import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.restdocs.operation.OperationRequest;
import org.springframework.restdocs.operation.OperationRequestFactory;
import org.springframework.restdocs.operation.OperationResponse;
import org.springframework.restdocs.operation.OperationResponseFactory;
import org.springframework.restdocs.operation.RequestCookie;
import org.springframework.restdocs.operation.ResponseCookie;
import org.springframework.restdocs.operation.preprocess.OperationPreprocessor;

/**
 * Masks JWT access tokens and refresh-token cookies in REST Docs snippets.
 * Integration tests in template_frontback sign real JWTs; this preprocessor keeps
 * generated snippets and {@code docs/index.html} free of credentials.
 */
public final class RestDocsSensitiveDataMasking {

    private static final OperationRequestFactory REQUEST_FACTORY = new OperationRequestFactory();
    private static final OperationResponseFactory RESPONSE_FACTORY = new OperationResponseFactory();

    private static final Pattern JWT = Pattern.compile("eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+");

    private static final Pattern AUTHORIZATION_BEARER = Pattern.compile(
            "Bearer\\s+eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+");

    private static final Pattern REFRESH_TOKEN_COOKIE = Pattern.compile(
            "refresh_token=eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+");

    private static final Pattern JSON_TOKEN_FIELD = Pattern.compile(
            "(\"token\"\\s*:\\s*\")(eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+)(\")");

    private static final Pattern JSON_ACCESS_TOKEN_FIELD = Pattern.compile(
            "(\"accessToken\"\\s*:\\s*\")(eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+)(\")");

    private RestDocsSensitiveDataMasking() {
    }

    public static OperationPreprocessor maskSensitiveData() {
        return new OperationPreprocessor() {
            @Override
            public OperationRequest preprocess(OperationRequest request) {
                return REQUEST_FACTORY.create(
                        request.getUri(),
                        request.getMethod(),
                        maskText(request.getContentAsString()).getBytes(StandardCharsets.UTF_8),
                        maskHeaders(request.getHeaders()),
                        request.getParts(),
                        maskRequestCookies(request.getCookies()));
            }

            @Override
            public OperationResponse preprocess(OperationResponse response) {
                return RESPONSE_FACTORY.create(
                        response.getStatus(),
                        maskHeaders(response.getHeaders()),
                        maskText(response.getContentAsString()).getBytes(StandardCharsets.UTF_8),
                        maskResponseCookies(response.getCookies()));
            }
        };
    }

    static String maskText(String text) {
        if (text == null || text.isBlank()) {
            return text;
        }

        String masked = AUTHORIZATION_BEARER.matcher(text).replaceAll("Bearer {access-token}");
        masked = REFRESH_TOKEN_COOKIE.matcher(masked).replaceAll("refresh_token={refresh-token}");
        masked = JSON_TOKEN_FIELD.matcher(masked).replaceAll("$1{jwt-access-token}$3");
        masked = JSON_ACCESS_TOKEN_FIELD.matcher(masked).replaceAll("$1{jwt-access-token}$3");
        return JWT.matcher(masked).replaceAll("{jwt}");
    }

    private static HttpHeaders maskHeaders(HttpHeaders headers) {
        HttpHeaders masked = new HttpHeaders();
        headers.forEach((name, values) -> values.forEach(value -> masked.add(name, maskText(value))));
        return masked;
    }

    private static Collection<RequestCookie> maskRequestCookies(Collection<RequestCookie> cookies) {
        return cookies.stream()
                .map(cookie -> new RequestCookie(cookie.getName(), maskCookieValue(cookie.getName(), cookie.getValue())))
                .collect(Collectors.toList());
    }

    private static Collection<ResponseCookie> maskResponseCookies(Collection<ResponseCookie> cookies) {
        return cookies.stream()
                .map(cookie -> new ResponseCookie(cookie.getName(), maskCookieValue(cookie.getName(), cookie.getValue())))
                .collect(Collectors.toList());
    }

    private static String maskCookieValue(String name, String value) {
        if ("refresh_token".equals(name)) {
            return "{refresh-token}";
        }
        return maskText(value);
    }
}
