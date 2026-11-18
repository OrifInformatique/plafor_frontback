package ch.sectioninformatique.template.user;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import ch.sectioninformatique.template.security.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import ch.sectioninformatique.template.security.MainRoleEnum;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity class representing a user in the system.
 * This class implements Spring Security's UserDetails interface to provide
 * user authentication and authorization functionality. It maps to the 'users'
 * table in the database and contains all necessary user information including
 * personal details, credentials, and roles.
 */
@Getter 
@Setter 
@Entity
@Table(name = "users")
@Builder
@NoArgsConstructor
@SQLDelete(sql = "UPDATE users SET deleted = true WHERE id = ?")
public class User {

    /** Unique identifier for the user */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private long id;

    /** First name of the user */
    @Column(nullable = false, name = "first_name")
    private String firstName;

    /** Last name of the user */
    @Column(nullable = true, name = "last_name")
    private String lastName;

    /** Login username of the user */
    @Column(unique = true, nullable = false)
    private String login;

    /** Timestamp indicating when the user was created */
    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;

    /** Timestamp indicating when the user was last updated */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    /** Flag indicating whether the user is soft-deleted */
    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    /**
     * Main role assigned to the user.
     * This role is owned and managed by the external spring-auth service; it is
     * received in the JWT {@code mainRole} claim and stored here only as a plain
     * enum value (no relation to the local {@code roles} table).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "main_role")
    @Builder.Default
    private MainRoleEnum mainRole = MainRoleEnum.USER;

    /** Additional application-specific (local) roles assigned to the user */
    @ManyToMany(fetch = FetchType.EAGER)
    @Builder.Default
    private Set<Role> appSpecificRoles = new HashSet<>();

    /** 
     * Constructs a new User with the specified details.
     *
     * @param id                 Unique identifier for the user
     * @param firstName          First name of the user
     * @param lastName           Last name of the user
     * @param login              Login username of the user
     * @param createdAt          Timestamp when the user was created
     * @param updatedAt          Timestamp when the user was last updated
     * @param deleted            Flag indicating if the user is soft-deleted
     * @param mainRole           Main role assigned to the user
     * @param appSpecificRoles   Additional application-specific roles assigned to the user
     */
    public User(long id,
                String firstName,
                String lastName,
                String login,
                Date createdAt,
                Date updatedAt,
                boolean deleted,
                MainRoleEnum mainRole,
                Set<Role> appSpecificRoles) {
        super();
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.login = login;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deleted = deleted;
        this.mainRole = mainRole;
        this.appSpecificRoles = appSpecificRoles;
    }

    /** 
     * Returns the collection of granted authorities for the user.
     * This includes authorities from both the main role and any
     * application-specific roles assigned to the user.
     *
     * @return Collection of GrantedAuthority objects representing the user's authorities
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        if (this.mainRole != null) {
            authorities.addAll(this.mainRole.getGrantedAuthorities());
        }
        if (this.appSpecificRoles != null) {
            for (Role role : this.appSpecificRoles) {
                authorities.addAll(role.getName().getGrantedAuthorities());
            }
        }
        return authorities;
    }

    /** 
     * Returns the username used to authenticate the user.
     *
     * @return The login username of the user
     */
    public String getUsername() {
        return login;
    }

    /** 
     * Indicates whether the user's account has expired.
     *
     * @return true if the account is non-expired, false otherwise
     */
    public boolean isAccountNonExpired() { return true; }

    /** 
     * Indicates whether the user's account is locked.
     *
     * @return true if the account is non-locked, false otherwise
     */
    public boolean isAccountNonLocked() { return true; }

    /** 
     * Indicates whether the user's credentials (password) have expired.
     *
     * @return true if the credentials are non-expired, false otherwise
     */
    public boolean isCredentialsNonExpired() { return true; }

    /** 
     * Indicates whether the user is enabled or disabled.
     *
     * @return true if the user is enabled, false otherwise
     */
    public boolean isEnabled() { return !deleted; } // Optional tie-in

    /**
     * Returns the main role assigned to the user.
     *
     * @return The main role of the user (owned by spring-auth)
     */
    public MainRoleEnum getMainRole() { return mainRole; }

    /** 
     * Returns a list of application-specific role names assigned to the user.
     *
     * @return List of role names as strings
     */
    public List<String> getAppSpecificRolesString() {
        List<String> names = new ArrayList<>();
        for (Role role : appSpecificRoles) {
            names.add(role.getName().name());
        }
        return names;
    }

    /** 
     * Returns all roles assigned to the user, including the main role
     * and any application-specific roles.
     *
     * @return Set of all Role objects assigned to the user
     */
    public Set<Role> getAllRoles() {
        Set<Role> allRoles = new HashSet<>();
        if (appSpecificRoles != null) {
            allRoles.addAll(appSpecificRoles);
        }
        return allRoles;
    }

    /**
     * Sets the main role assigned to the user.
     *
     * @param role The main role to set (owned by spring-auth)
     */
    public void setMainRole(MainRoleEnum role) { mainRole = role; }

    /** 
     * Adds an application-specific role to the user.
     *
     * @param role The Role to add to the user's application-specific roles
     */
    public void addAppSpecificRoles(Role role) { appSpecificRoles.add(role); }
}
