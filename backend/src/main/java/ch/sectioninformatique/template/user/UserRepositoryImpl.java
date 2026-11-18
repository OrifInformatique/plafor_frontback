package ch.sectioninformatique.template.user;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of custom repository methods for User entity.
 * This class provides the implementation for permanent deletion of users,
 * allowing permanent removal of user records from the database.
 */
@Repository
@Transactional
public class UserRepositoryImpl implements UserRepositoryPermanentDelete {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void deletePermanentlyById(Long id) {
        // Remove join-table rows first to avoid FK constraint failures on hard delete.
        entityManager.createNativeQuery(
            "DELETE FROM users_app_specific_roles WHERE users_app_specifique_id = :id")
            .setParameter("id", id)
            .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM users WHERE id = :id")
                .setParameter("id", id)
                .executeUpdate();
    }
}