package ch.sectioninformatique.template.app.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Generic AppException carrying an explicit message key and arguments.
 */
public class AppMessageKeyException extends AppException implements MessageKeyProvider {

    private final String messageKey;
    private final Object[] messageArgs;

    /**
     * Constructs a new exception with a message key and optional arguments.
     *
     * @param status The HTTP status code to be returned in the response
     * @param messageKey The message key to resolve
     * @param messageArgs Optional arguments for message formatting
     */
    public AppMessageKeyException(HttpStatus status, String messageKey, Object... messageArgs) {
        super(status);
        this.messageKey = messageKey;
        // Normalize to a shared empty array to keep handler logic simple.
        this.messageArgs = messageArgs == null ? NO_ARGS : messageArgs;
    }

    @Override
    public String getMessageKey() {
        return messageKey;
    }

    @Override
    public Object[] getMessageArgs() {
        return messageArgs;
    }
}
