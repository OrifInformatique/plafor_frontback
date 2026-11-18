package ch.sectioninformatique.template.app;

import java.util.Locale;

/**
 * Selects which subset of a soft-deletable collection an endpoint returns,
 * based on the {@code deleted} flag of each record.
 *
 * <p>Bound from the {@code ?state=} query parameter (case-insensitive) by
 * {@code config.WebConfig}. When the parameter is absent, controllers default
 * to {@link #ACTIVE} so that soft-deleted records stay hidden unless explicitly
 * asked for.
 */
public enum DeletionFilter {

    /** Only active (non-soft-deleted) records. This is the default. */
    ACTIVE,

    /** Only soft-deleted records. */
    DELETED,

    /** Every record, regardless of its soft-delete state. */
    ALL;

    /**
     * Resolves the query-parameter form ({@code active} / {@code deleted} /
     * {@code all}) to an enum constant, case-insensitively.
     *
     * @param value the raw query-parameter value
     * @return the matching filter
     * @throws IllegalArgumentException if {@code value} matches no constant
     */
    public static DeletionFilter fromParam(String value) {
        try {
            return valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalArgumentException(
                    "expected one of: active, deleted, all");
        }
    }
}
