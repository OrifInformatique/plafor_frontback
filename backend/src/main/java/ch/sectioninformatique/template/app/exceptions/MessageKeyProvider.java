package ch.sectioninformatique.template.app.exceptions;

/**
 * Contract for providing message keys and arguments for localization.
 */
public interface MessageKeyProvider {
    // Reusable empty arguments array to avoid unnecessary allocations
    Object[] NO_ARGS = new Object[0];

    /**
     * Returns the message key for this exception, which can be used to look up
     * a localized error message.
     *
     * @return The message key as a String
     */
    String getMessageKey();

    /**
     * Returns the arguments for the message key, which can be used to format
     * the localized error message.
     *
     * @return An array of arguments for the message key
     */
    default Object[] getMessageArgs() {
        return NO_ARGS;
    }
}
