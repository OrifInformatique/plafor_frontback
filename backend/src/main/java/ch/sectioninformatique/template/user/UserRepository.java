package ch.sectioninformatique.template.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;

/**
 * Repository interface for User entity operations.
 * This interface extends JpaRepository to provide basic CRUD operations
 * and adds custom query methods for user-specific operations.
 * It provides methods for:
 * - Finding users by login
 * - Checking user existence
 * - Standard CRUD operations inherited from JpaRepository
 */
public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryPermanentDelete {

    /**
     * Finds a user by their login username.
     * This method is used for:
     * - User authentication
     * - User lookup during operations
     * - Checking user existence
     *
     * @param login The login username to search for (case-sensitive)
     * @return Optional containing the user if found, empty Optional otherwise
     */
    Optional<User> findByLogin(String login);

    /**
     * Returns all users that are not soft-deleted.
     * 
     * @return List of active users
     */
    List<User> findAllByDeletedFalse();

    /**
     * Returns all users including those that are soft-deleted.
     * 
     * @return List of all users
     */
    @Query("SELECT u FROM User u")
    List<User> findAllIncludingDeleted();

    /**
     * Returns only soft-deleted users.
     * 
     * @return List of soft-deleted users
     */
    @Query("SELECT u FROM User u WHERE u.deleted = true")
    List<User> findAllDeleted();

    /**
     * Restores a soft-deleted user.
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.deleted = false WHERE u.id = :id")
    void restoreById(Long id);

    /**
     * Checks if a user with the given login username exists.
     * This method is used for:
     * - Validating new user registration
     * - Checking login uniqueness
     * - Preventing duplicate user accounts
     *
     * @param login The login username to check (case-sensitive)
     * @return true if a user with the given login exists, false otherwise
     */
    boolean existsByLogin(String login);
}
