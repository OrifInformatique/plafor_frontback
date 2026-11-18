package ch.sectioninformatique.template.item;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import jakarta.transaction.Transactional;

/**
 * Repository interface for managing Item entities in the database.
 * This interface extends Spring's CrudRepository to provide basic CRUD
 * operations
 * for the Item entity. It is automatically implemented by Spring Data JPA.
 */
@SuppressWarnings("null")
public interface ItemRepository extends CrudRepository<Item, Long> {

    /**
     * Finds all items that are not soft deleted.
     *
     * @return a list of non-deleted items
     */
    List<Item> findAllByDeletedFalse();

    /**
     * Finds only the items that are soft deleted.
     *
     * @return a list of soft-deleted items
     */
    List<Item> findAllByDeletedTrue();

    /**
     * Finds all items, including soft deleted ones.
     *
     * @return a list of all items
     */
    @Query("SELECT i FROM Item i")
    List<Item> findAllIncludingDeleted();

    /**
     * Checks if an item with the specified ID exists.
     *
     * @param id the ID of the item to check
     * @return true if the item exists, false otherwise
     */
    boolean existsById(Long id);

    /**
     * Deletes an item permanently by its ID.
     *
     * @param id the ID of the item to delete
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM Item i WHERE i.id = :id")
    void deletePermanentlyById(Long id);

    /**
     * Deletes all items permantently.
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM Item")
    void deleteAllPermanently();
}
