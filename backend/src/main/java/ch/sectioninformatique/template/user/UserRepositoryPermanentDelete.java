package ch.sectioninformatique.template.user;

/**
 * Custom repository interface for hard deletion of User entities.
 * This interface defines methods for permanently removing user records
 * from the database, bypassing any soft delete mechanisms.
 */
public interface UserRepositoryPermanentDelete {
    void deletePermanentlyById(Long id);
}
