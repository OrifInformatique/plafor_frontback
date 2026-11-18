package ch.sectioninformatique.template.security;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;

/**
 * Web configuration class for the application.
 * This class configures web-related settings including:
 * - CORS (Cross-Origin Resource Sharing) configuration
 * - Web MVC settings
 * - Filter registration
 */
@Configuration
@EnableWebMvc
public class WebConfig {

    /** Maximum age of CORS preflight response cache in seconds (1 hour) */
    private static final Long MAX_AGE = 3600L;

    /** Order of the CORS filter to ensure it runs before Spring Security filter */
    private static final int CORS_FILTER_ORDER = -102;

    /**
     * Creates and configures a CORS filter for handling cross-origin requests.
     * This filter:
     * - Allows requests from specified origins (localhost:8080, 3000, 4000)
     * - Permits specific HTTP methods (GET, POST, PUT, DELETE)
     * - Allows required headers (Authorization, Content-Type, Accept)
     * - Sets preflight response cache duration
     * - Is configured to run before Spring Security filter
     *
     * @return FilterRegistrationBean containing the configured CORS filter
     */
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:8080",
                "http://localhost:3000",
                "http://localhost:4000"));
        config.setAllowedHeaders(Arrays.asList(
                HttpHeaders.AUTHORIZATION,
                HttpHeaders.CONTENT_TYPE,
                HttpHeaders.ACCEPT));
        config.setAllowedMethods(Arrays.asList(
                HttpMethod.GET.name(),
                HttpMethod.POST.name(),
                HttpMethod.PUT.name(),
                HttpMethod.DELETE.name(),
                HttpMethod.OPTIONS.name()));
        config.setMaxAge(MAX_AGE);
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<CorsFilter>(new CorsFilter(source));

        // should be set order to -100 because we need to CorsFilter before
        // SpringSecurityFilter
        bean.setOrder(CORS_FILTER_ORDER);
        return bean;
    }
}
