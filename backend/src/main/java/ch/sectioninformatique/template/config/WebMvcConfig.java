package ch.sectioninformatique.template.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import ch.sectioninformatique.template.app.DeletionFilter;
import ch.sectioninformatique.template.security.RoleScope;

/**
 * Web MVC customizations: registers converters used to bind request parameters.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(@NonNull FormatterRegistry registry) {
        registry.addConverter(new StringToDeletionFilterConverter());
        registry.addConverter(new StringToRoleScopeConverter());
    }

    /**
     * Binds the {@code ?state=} query parameter to {@link DeletionFilter},
     * accepting {@code active} / {@code deleted} / {@code all} in any case.
     */
    static class StringToDeletionFilterConverter implements Converter<String, DeletionFilter> {

        @Override
        public DeletionFilter convert(@NonNull String source) {
            return DeletionFilter.fromParam(source);
        }
    }

    /**
     * Binds the {@code ?scope=} query parameter to {@link RoleScope},
     * accepting {@code local} / {@code main} / {@code all} in any case.
     */
    static class StringToRoleScopeConverter implements Converter<String, RoleScope> {

        @Override
        public RoleScope convert(@NonNull String source) {
            return RoleScope.fromParam(source);
        }
    }
}
