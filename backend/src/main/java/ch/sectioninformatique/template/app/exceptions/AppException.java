package ch.sectioninformatique.template.app.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Base application exception carrying an HTTP status for API responses.
 */
public class AppException extends RuntimeException {

    /**
     * HTTP status to return in the response.
     */
    private final HttpStatus status;

    /**
     * Constructs a new AppException with the specified status.
     *
     * @param status The HTTP status code to be returned in the response
     */
    public AppException(HttpStatus status) {
        super();
        this.status = status;
    }

    /**
     * @return HTTP status to return for this exception
     */
    public HttpStatus getStatus() {
        return status;
    }
}

