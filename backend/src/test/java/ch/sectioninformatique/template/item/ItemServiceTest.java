package ch.sectioninformatique.template.item;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import ch.sectioninformatique.template.app.DeletionFilter;
import ch.sectioninformatique.template.security.MainRoleEnum;
import ch.sectioninformatique.template.user.User;
import ch.sectioninformatique.template.user.UserRepository;

@SpringBootTest
public class ItemServiceTest {

    @Autowired
    private ItemService itemService;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void getItemsTest() {
        // Clear items table
        itemRepository.deleteAllPermanently();

        User author = User.builder()
            .firstName("author")
            .lastName("test")
            .login("test.author@test.com")
            .mainRole(MainRoleEnum.USER)
            .build();
        author = userRepository.save(author);

        Item item = new Item();
        item.setName("Test Item 1");
        item.setDescription("This is a test item.");
        item.setAuthor(author);
        itemRepository.save(item);

        item = new Item();
        item.setName("Test Item 2");
        item.setDescription("This is a test item.");
        item.setAuthor(author);
        itemRepository.save(item);

        item = new Item();
        item.setName("Test Item 3");
        item.setDescription("This is soft deleted test item.");
        item.setAuthor(author);
        item.setDeleted(true);
        item = itemRepository.save(item);

        // ACTIVE returns only non-deleted items
        List<Item> items = itemService.getItems(DeletionFilter.ACTIVE);
        assertEquals(2, items.size());

        // DELETED returns only soft-deleted items
        items = itemService.getItems(DeletionFilter.DELETED);
        assertEquals(1, items.size());

        // ALL returns every item, including soft-deleted ones
        items = itemService.getItems(DeletionFilter.ALL);
        assertEquals(3, items.size());

        // Clear items table
        itemRepository.deleteAllPermanently();
        // Clear author from database
        userRepository.deletePermanentlyById(author.getId());
    }

    @Test
    public void deleteAuthorTest() {

        User author = User.builder()
            .firstName("author")
            .lastName("test")
            .login("test.author@test.com")
            .mainRole(MainRoleEnum.USER)
            .build();
        userRepository.save(author);

        Item item = new Item();
        item.setName("Test Item");
        item.setDescription("This is a test item.");
        item.setAuthor(author);

        itemRepository.save(item);

        userRepository.deletePermanentlyById(author.getId());

        Item updatedItem = itemRepository.findById(item.getId()).orElseThrow();

        //Then
        assertEquals(null, updatedItem.getAuthor());
    }
}
