package ch.sectioninformatique.template.item;
import org.springframework.http.HttpStatus;

import ch.sectioninformatique.template.app.exceptions.AppException;
import ch.sectioninformatique.template.app.exceptions.MessageKeyProvider;

public class ItemExceptions {

    public static class ItemNotFoundException extends AppException implements MessageKeyProvider {
  
        /**
        * Constructs a new ItemNotFoundException with a message indicating
        * that the item with the specified ID could not be found.
        *
        * @param id The ID of the item that was not found
        */
        public ItemNotFoundException(Long id) {
            super(HttpStatus.NOT_FOUND);
        }

        @Override
        public String getMessageKey() {
            return "item.notFound";
        }
    }


    public static class UnauthorizedItemException extends AppException implements MessageKeyProvider {
    
        /**
        * Constructs a new UnauthorizedItemException with a message indicating
        * that the user can only perform the specified operation on their own items.
        *
        * @param message The operation that was attempted (e.g., "update", "delete")
        */
        public UnauthorizedItemException(String message) {
            super(HttpStatus.UNAUTHORIZED);
            // The operation is encoded in the i18n bundle, so no args are passed here.
        }

        @Override
        public String getMessageKey() {
            return "item.unauthorized";
        }
    }

}
