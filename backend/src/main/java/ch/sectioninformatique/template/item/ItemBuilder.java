package ch.sectioninformatique.template.item;

import ch.sectioninformatique.template.user.User;

/**
 * Builder class for creating Item instances.
 * This class implements the Builder pattern to provide a fluent interface
 * for constructing Item objects with optional parameters.
 */
public class ItemBuilder {
    private String name;
    private String description;
    private User author;

    /**
     * Default constructor for ItemBuilder.
     */
    public ItemBuilder() {
    }

    /**
     * Sets the name of the item to be created.
     *
     * @param name The name to set for the item
     * @return This builder instance for method chaining
     */
    public ItemBuilder setName(String name) {
        this.name = name;
        return this;
    }

    /**
     * Sets the description of the item to be created.
     *
     * @param description The description to set for the item
     * @return This builder instance for method chaining
     */
    public ItemBuilder setDescription(String description) {
        this.description = description;
        return this;
    }

    /**
     * Sets the author of the item to be created.
     *
     * @param author The user who will be set as the author of the item
     * @return This builder instance for method chaining
     */
    public ItemBuilder setAuthor(User author) {
        this.author = author;
        return this;
    }

    /**
     * Builds and returns a new Item instance with the configured properties.
     *
     * @return A new Item instance with the set properties
     */
    public Item build() {
        return new Item(name, description, author);
    }
}