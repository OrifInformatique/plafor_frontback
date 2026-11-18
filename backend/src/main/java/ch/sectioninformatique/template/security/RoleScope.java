package ch.sectioninformatique.template.security;

import java.util.Locale;

/**
 * Selects which roles the {@code GET /roles} endpoint returns.
 *
 * <p>Bound from the {@code ?scope=} query parameter (case-insensitive) by
 * {@code config.WebMvcConfig}. When the parameter is absent, the controller
 * defaults to {@link #LOCAL} so that callers keep seeing only the roles this
 * application actually owns.
 */
public enum RoleScope {

    /** Only the local roles defined in this app ({@link LocalRoleEnum}). This is the default. */
    LOCAL,

    /** Only the main roles owned by spring-auth ({@link MainRoleEnum}). */
    MAIN,

    /** Both local and main roles. */
    ALL;

    /**
     * Resolves the query-parameter form ({@code local} / {@code main} / {@code all})
     * to an enum constant, case-insensitively.
     *
     * @param value the raw query-parameter value
     * @return the matching scope
     * @throws IllegalArgumentException if {@code value} matches no constant
     */
    public static RoleScope fromParam(String value) {
        try {
            return valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalArgumentException(
                    "expected one of: local, main, all");
        }
    }
}
