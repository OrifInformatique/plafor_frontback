package ch.sectioninformatique.template.config;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.context.i18n.LocaleContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Locale;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Pattern;

@Configuration
public class LocaleConfig implements WebMvcConfigurer {

    // Constants for message source configuration and locale resolution.
    private static final String MESSAGE_RESOURCES_PATTERN = "classpath*:messages/**/*.properties";
    private static final String MESSAGE_SEGMENT = "/messages/";
    private static final String PROPERTIES_EXTENSION = ".properties";
    private static final String CLASSPATH_MESSAGES_PREFIX = "classpath:messages/";
    private static final String DEFAULT_MESSAGE_BASENAME = "classpath:messages/messages";
    private static final String REQUEST_LOCALE_ATTRIBUTE = "request.locale.override";

    private static final Pattern LOCALE_SUFFIX_PATTERN = Pattern.compile("_[a-z]{2}(?:_[A-Z]{2})?$");

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(resolveMessageBasenames());
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setCacheSeconds(3600);
        return messageSource;
    }

    private String[] resolveMessageBasenames() {
        try {
            Resource[] resources = new PathMatchingResourcePatternResolver().getResources(MESSAGE_RESOURCES_PATTERN);
            Set<String> basenames = new TreeSet<>();

            for (Resource resource : resources) {
                // Normalize message bundle paths to basenames (strip locale suffixes).
                String basename = resolveResourceBasename(resource);
                if (basename != null) {
                    basenames.add(basename);
                }
            }

            if (basenames.isEmpty()) {
                basenames.add(DEFAULT_MESSAGE_BASENAME);
            }

            return basenames.toArray(new String[0]);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to resolve i18n message bundles from classpath", exception);
        }
    }

    private String resolveResourceBasename(Resource resource) throws IOException {
        String resourceUrl = resource.getURL().toString().replace('\\', '/');
        int messagesIndex = resourceUrl.lastIndexOf(MESSAGE_SEGMENT);
        if (messagesIndex < 0) {
            return null;
        }

        String relativePath = resourceUrl.substring(messagesIndex + MESSAGE_SEGMENT.length());
        if (!relativePath.endsWith(PROPERTIES_EXTENSION)) {
            return null;
        }

        String withoutExtension = relativePath.substring(0, relativePath.length() - PROPERTIES_EXTENSION.length());
        // Collapse locale-specific bundles (e.g., messages_fr) into a single basename.
        String basenameWithoutLocale = LOCALE_SUFFIX_PATTERN.matcher(withoutExtension).replaceFirst("");
        return CLASSPATH_MESSAGES_PREFIX + basenameWithoutLocale;
    }

    /**
     * Resolves locale from the {@code ?lang=} request attribute (set by the interceptor),
     * falling back to the {@code Accept-Language} header. Default locale is French.
     */
    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver() {
            @Override
            public Locale resolveLocale(HttpServletRequest request) {
                Object overriddenLocale = request.getAttribute(REQUEST_LOCALE_ATTRIBUTE);
                if (overriddenLocale instanceof Locale locale) {
                    return locale;
                }
                return super.resolveLocale(request);
            }

            @Override
            public void setLocale(HttpServletRequest request, HttpServletResponse response, Locale locale) {
                if (locale != null) {
                    request.setAttribute(REQUEST_LOCALE_ATTRIBUTE, locale);
                }
            }
        };
        localeResolver.setDefaultLocale(Locale.FRANCE);
        return localeResolver;
    }

    @Bean
    public LocalValidatorFactoryBean validator(MessageSource messageSource) {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.setValidationMessageSource(messageSource);
        return validator;
    }

    /** Intercepts {@code ?lang=} query parameter to override locale for the duration of the request. */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
                String lang = request.getParameter("lang");
                if (lang != null && !lang.isBlank()) {
                    Locale locale = Locale.forLanguageTag(lang.replace('_', '-'));
                    request.setAttribute(REQUEST_LOCALE_ATTRIBUTE, locale);
                    LocaleContextHolder.setLocale(locale);
                }
                return true;
            }

            @Override
            public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
                LocaleContextHolder.resetLocaleContext();
            }
        });
    }
}
