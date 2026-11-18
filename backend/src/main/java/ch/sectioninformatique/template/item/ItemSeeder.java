package ch.sectioninformatique.template.item;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ch.sectioninformatique.template.user.User;
import ch.sectioninformatique.template.user.UserRepository;
import org.springframework.core.annotation.Order;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Component responsible for seeding initial item data in the database.
 * This seeder runs after the application starts and creates sample items
 * if the database is empty. It assigns random authors to each item from
 * the existing users (excluding the "deleted user").
 */
@Component
@Order(3)
public class ItemSeeder implements CommandLineRunner {
    
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    /**
     * Constructs a new ItemSeeder with the required repositories.
     *
     * @param itemRepository Repository for item operations
     * @param userRepository Repository for user operations
     */
    public ItemSeeder(ItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    /**
     * Executes the seeder when the application starts.
     * This method is called by Spring Boot after the application context is loaded.
     *
     * @param args Command line arguments passed to the application
     * @throws Exception If an error occurs during the seeding process
     */
    @Override
    public void run(String... args) throws Exception {
        loadItemData();
    }

    /**
     * Loads initial item data into the database if it's empty.
     * Creates 20 sample items with random authors from existing users.
     * Each item has a name and description in French.
     * The "deleted user" (ID 1) is excluded from being an author.
     *
     * @throws RuntimeException if no users are found to assign as authors
     */
    private void loadItemData() {
        if (itemRepository.count() == 0) {

            var users = new ArrayList<User>();
            userRepository.findAll().forEach(user -> {
                if (user.getId() != 1L) {  
                    users.add(user);
                }
            });

            if (users.isEmpty()) {
                throw new RuntimeException("Aucun utilisateur trouvé pour créer les items");
            }

            var itemsData = List.of(
                new String[]{"Premier objet", "Description du premier objet"},
                new String[]{"Deuxième objet", "Description du deuxième objet"},
                new String[]{"Troisième objet", "Description du troisième objet"},
                new String[]{"Quatrième objet", "Description du quatrième objet"},
                new String[]{"Cinquième objet", "Description du cinquième objet"},
                new String[]{"Sixième objet", "Description du sixième objet"},
                new String[]{"Septième objet", "Description du septième objet"},
                new String[]{"Huitième objet", "Description du huitième objet"},
                new String[]{"Neuvième objet", "Description du neuvième objet"},
                new String[]{"Dixième objet", "Description du dixième objet"},
                new String[]{"Onzième objet", "Description du onzième objet"},
                new String[]{"Douzième objet", "Description du douzième objet"},
                new String[]{"Treizième objet", "Description du treizième objet"},
                new String[]{"Quatorzième objet", "Description du quatorzième objet"},
                new String[]{"Quinzième objet", "Description du quinzième objet"},
                new String[]{"Seizième objet", "Description du seizième objet"},
                new String[]{"Dix-septième objet", "Description du dix-septième objet"},
                new String[]{"Dix-huitième objet", "Description du dix-huitième objet"},
                new String[]{"Dix-neuvième objet", "Description du dix-neuvième objet"},
                new String[]{"Vingtième objet", "Description du vingtième objet"}
            );

            itemsData.forEach(data -> {
                User randomAuthor = users.get(new Random().nextInt(users.size()));
                
                Item item = new ItemBuilder()
                    .setName(data[0])
                    .setDescription(data[1])
                    .setAuthor(randomAuthor)
                    .build();
                
                itemRepository.save(item);
            });
        }
    }
}