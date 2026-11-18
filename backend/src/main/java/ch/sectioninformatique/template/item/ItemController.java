package ch.sectioninformatique.template.item;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.sectioninformatique.template.app.DeletionFilter;
import ch.sectioninformatique.template.item.ItemExceptions.ItemNotFoundException;
import ch.sectioninformatique.template.item.ItemExceptions.UnauthorizedItemException;

/**
 * REST controller for managing items in the system.
 * This controller provides endpoints for CRUD operations on items,
 * with appropriate security checks and authorization requirements.
 * All responses are automatically converted to JSON format.
 */
@RequestMapping("/items")
@RestController
public class ItemController {

    @Autowired
    private ItemService itemService;

    /**
     * Constructor for initializing the ItemController with the required service.
     *
     * @param itemService The item service to use
     */
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    /**
     * Retrieves items in the system, filtered by their soft-delete state.
     * Requires the 'item:read' authority to access.
     *
     * @param state which subset of items to return: {@code active} (default),
     *              {@code deleted}, or {@code all}
     * @return the matching list of items
     */
    @PreAuthorize("hasAuthority('item:read')")
    @GetMapping
    public List<ItemsDTO> getItems(@RequestParam(defaultValue = "active") DeletionFilter state)
    {
            List<ItemsDTO> items = new ArrayList<>();
            itemService.getItems(state).forEach(item -> items.add(new ItemsDTO(item)));
            return items;
    }


    /**
     * Retrieves a specific item by its ID.
     * Requires the 'item:read' authority to access.
     *
     * @param id The unique identifier of the item to retrieve
     * @return The requested item
     * @throws ItemNotFoundException if the item is not found
     */
    @PreAuthorize("hasAuthority('item:read')")
    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {
        return itemService.getItem(id)
            .orElseThrow(() -> new ItemNotFoundException(id));
    }
    
    /**
     * Creates a new item in the system.
     * Requires the 'item:write' authority to access.
     *
     * @param item The item data to create
     * @return The newly created item
     */
    @PreAuthorize("hasAuthority('item:write')")
    @PostMapping("/")
    public Item createItem(@RequestBody Item item) {
        return itemService.createItem(item);
    }

    /**
     * Updates an existing item in the system.
     * Requires the 'item:update' authority to access.
     *
     * @param id The unique identifier of the item to update
     * @param item The updated item data
     * @return The updated item
     * @throws ItemNotFoundException if the item is not found
     * @throws UnauthorizedItemException if the user is not authorized to update the item
     */
    @PreAuthorize("hasAuthority('item:update')")
    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @RequestBody Item item) {
        return itemService.updateItem(id, item);
    }

    /**
     * Restore a soft-deleted item in the system.
     * Requires the 'item:write' authority to access.
     * @param id The unique identifier of the item to restore
     * @return The restored item
     */
    @PreAuthorize("hasAuthority('item:update')")
    @PutMapping("/{id}/restore")
    public Item restoreItem(@PathVariable Long id) {
        return itemService.restoreItem(id);
    }

    /**
     * Deletes an item from the system.
     * Requires either the 'item:delete' authority or a combination of
     * 'item:write' authority and appropriate role (ROLE_USER or ROLE_ADMIN).
     *
     * @param id The unique identifier of the item to delete
     * @throws ItemNotFoundException if the item is not found
     * @throws UnauthorizedItemException if the user is not authorized to delete the item
     */
    @PreAuthorize("hasAuthority('item:delete') || ((hasRole('ROLE_USER') || hasRole('ROLE_ADMIN')) && hasAuthority('item:write'))")
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean softDelete) {
        if(softDelete) {
            itemService.deleteItem(id);
        } else {
            itemService.deletePermanentById(id);
        }
    }
}
