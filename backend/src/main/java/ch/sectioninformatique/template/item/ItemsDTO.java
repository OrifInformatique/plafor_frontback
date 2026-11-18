package ch.sectioninformatique.template.item;

import java.util.Date;

import lombok.Data;

//Data transfer object for Item entity, used to transfer item data excluding useless information such as the author id and
//It also includes the author's first and last name for easier display on the frontend.

@Data
public class ItemsDTO {
    private Long id;
    private String name;
    private String description;
    private String authorFirstName;
    private String authorLastName;
    private Date createdAt;
    private Date updatedAt;
    private boolean deleted;

    public ItemsDTO(Item item) {
        this.id = item.getId();
        this.name = item.getName();
        this.description = item.getDescription();
        this.authorFirstName = item.getAuthor().getFirstName();
        this.authorLastName = item.getAuthor().getLastName();
        this.createdAt = item.getCreatedAt();
        this.updatedAt = item.getUpdatedAt();
        this.deleted = item.isDeleted();
    }

}