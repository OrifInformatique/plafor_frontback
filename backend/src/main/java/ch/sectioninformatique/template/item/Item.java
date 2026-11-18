package ch.sectioninformatique.template.item;

import ch.sectioninformatique.template.user.User;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity class representing an item in the system.
 * This class maps to the 'items' table in the database and contains information
 * about items including their name, description, author, and timestamps.
 */
@Getter 
@Setter 
@Table(name = "items")
@Entity
@NoArgsConstructor
@SQLDelete(sql = "UPDATE items SET deleted = true WHERE id = ?")
public class Item {

    /**
     * Unique identifier for the item.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The name of the item.
     */
    private String name;

    /**
     * Detailed description of the item.
     * Maximum length is 1000 characters.
     */
    @Column(length=1000)
    private String description;

    /**
     * The user who created this item.
     * Uses eager fetching to ensure author information is always available.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "author_id", nullable = true)
    private User author;


    /**
     * Timestamp when the item was created.
     * This field cannot be updated after creation.
     */
    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;

    /**
     * Timestamp when the item was last updated.
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(nullable = false)
    private boolean deleted = false;
    
    /**
     * Creates a new item with the specified details.
     *
     * @param name The name of the item
     * @param description The description of the item
     * @param author The user who created the item
     */
    public Item(String name, String description, User author) {
        this.name = name;   
        this.description = description;
        this.author = author;
    }
}
