# USER PACKAGE
USER Documentation of the template_frontback

## Table of Contents
- [User.java](#userdtojava)
- [UserController.java](#usercontrollerjava)
    - [Dependencies](#dependencies)
    - [Endpoints](#endpoints)
- [UserDTO.java](#userdtojava)
    - [Annotations](#annotations)
    - [Fields](#fields)
- [UserExceptions.java](#userexceptionsjava)
- [UserMapper.java](#usermapperjava)
- [UserRepository.java](#userrepositoryjava)
- [UserRepositoryImpl.java](#userrepositoryimpljava)
- [UserRepositoryPermanentDelete.java](#userrepositorypermanentdeletejava)
- [UserSeeder.java](#userseederjava)
- [UserService.java](#userservicejava)

---

## *User.java*
`User` is a JPA Entity class that represents the user in the database.

It stores information like login, account status, timestamps, and roles.

This class also uses Spring Security's methods to check acquired permissions and if the account is enabled.

It contains :
- `id`,
- `firstName`,
- `lastName`,
- `login`,
- `createdAt`,
- `updatedAt`,
- `deleted`,
- `mainRole`,
- `appSpecificRoles`

In template_frontback, each user has a main role (`mainRole`), and additional app-specific roles (`appSpecificRoles`) that may only apply to the currently used application.

Each role has certain permissions like reading, updating, or creating things.

---

## *UserController.java*
This is a User REST Controller.\
It decides what HTTP Request leads to what backend action.

`UserController` doesn't directly access to the database.\
Instead, it uses `UserService` which contains all the user specific logic.

It also uses `AuthService` to communicate with the authentication service.


### Dependencies
- `UserService` :\
UserService is used to do user related operations :
    - Get users
    - Update users
    - Delete users (Soft or not)
    - Restore users
    - Manage user roles

- `MessageSource` :\
MessageSource is used to get translated text and avoid hardcoding it.

- `AuthClient` :\
It communicates with the internal or external authentication service to :
    - Promote a user to manager
    - Remove manager privileges
    - Promote a user to administrator
    - Remove administrator privileges
    - Downgrade an administrator to manager

### Endpoints

- `GET /users/me` :
    - Get current local user

- `GET /users/all` :
    - Get all users

- `GET /users/all-with-deleted` :
    - Get all users, soft deleted included

- `GET /users/deleted` :
    - Get soft deleted users

- `DELETE /users/{userId}/{global}` :
    - Soft delete user

- `DELETE /users/{userId}/{global}/{hardDelete}` :
    - Soft or hard delete user

- `PUT /users/{userId}/promote-manager` :
    - Promote manager

- `PUT /users/{userId}/revoke-manager` :
    - Revoke manager privileges

- `PUT /users/{userId}/promote-admin` :
    - Promote an admin

- `PUT /users/{userId}/revoke-admin` :
    - Revoke administrator privileges

- `PUT /users/{userId}/downgrade-admin` :
    - Downgrade an Admin -> Manager

- `PUT /users/{userId}/promote-local-manager-role` :
    - Add local role

- `PUT /users/{id}` :
    - Update user

- `PUT /users/{id}/restore` :
    - Restore soft deleted user (hard deleted users cannot be restored)

---



## *UserDto.java*

`UserDTO` is a Data Transfer Object (DTO), that's used to transfer data to the database.\
It is used to decide which user information to send to the database without exposing the `User` Entity.


### Annotations
- `@Data` :  
    Automatically generates things like :
    - Getters
    - Setters
    - toString()
    - equals()
    - hashCode()

    toString(), equals() and hashCode() already exist in java, But `@Data` overrides them with new versions to be more compatible with our DTO.

- `@Builder(toBuilder = true / false)` :  
    Creates Builder for constructing the DTO Instances.

    Instead of:

        UserDto user = new UserDto();
            user.setFirstName("John");
            user.setLastName("Smith");

    You can do:

        UserDto user = UserDto.builder()
            .firstName("John")
            .lastName("Smith")
            .build();

    toBuilder = true also allows an existing object to be used as the starting point for a new one.

### Fields
- `id`:\
Unique identifier of the user.

- `firstName`:\
First name of the user

- `lastName`:\
Last name of the user

- `login`:\
Unique e-mail of the user

- `token`:\
User's JWN Authentication token

- `deleted`:\
Indicates if user is soft deleted

- `mainRole`:\
User's main role stored as a string

- `appSpecificRoles`:\
User's application specific roles as strings

- `permissions`:\
User's permissions
    
Some values become strings because DTOs are supposed to transfer simple data.

### Relation to UserMapper
`UserMapper` converts between the Entity and the DTO.

So when controller does :

    @RequestBody UserDto user

It receives user data, not the user entity.

---



## *UserExceptions.java*

Contains all user-related exceptions.

### Defined exceptions :

- `UserNotFoundException` :\
    Used when user cannot be found\
    Returns : 404 NOT_FOUND

- `UserNotFoundByLoginException` :\
    Used when user cannot be found using their login\
    Returns : 404 NOT_FOUND

- `UserAlreadyHasRoleException` :\
    Used when user already has the requested role\
    Returns : 409 CONFLICT

- `UserCreationException` :\
    Used when user creation fails\
    Returns : 400 BAD_REQUEST

- `UserUpdateException` :\
    Used when user updating fails\
    Returns : 400 BAD_REQUEST

- `UserDeletionException` :\
    Used when user deleting fails\
    Returns : 400 BAD_REQUEST

- `UserAlreadyDeletedException` :\
    Used when soft deleting an already soft deleted user\
    Returns : 409 CONFLICT

- `UserPromotionException` :\
    Used when user role promotion fails\
    Returns : 400 BAD_REQUEST

- `RoleNotFoundException` :\
    Used when requested role doesn't exist\
    Returns : 404 NOT_FOUND

- `DefaultRoleNotFoundException` :\
    Used when user's default role cannot be found (that's an internal error!)\
    Returns : 500 INTERNAL_SERVER_ERROR

- `UserValidationException` :\
    Used when user fails validation\
    Returns : 400 BAD_REQUEST

- `UserMappingException` :\
    Used when converting between User DTO and User Entity fails\
    Returns : 500 INTERNAL_SERVER_ERROR

- `UserSeedingException` :\
    Used when creating default pre-created users fails\
    Returns : 500 INTERNAL_SERVER_ERROR

- `UserRetrievalException` :\
    Used when retrieving user fails\
    Returns : 500 INTERNAL_SERVER_ERROR

- `InactiveUserException` :\
    Used when an action is attempted on an inactive user\
    Returns : 403 FORBIDDEN

- `UserRoleUpdateException` :\
    Used when updating user's main role fails\
    Returns : 400 BAD_REQUEST

- `DuplicateUserException` :\
    Used when duplicate user information is detected (Example : two users have the same login)\
    Returns : 409 CONFLICT

- `PermanentUserDeletionException` :\
    Used when hard deleting a user fails\
    Returns : 400 BAD_REQUEST

---



## *UserMapper.java*

This is the `UserMapper`.

It is responsible for converting user-related objects between different formats.

It converts:

`User` --> `UserDto`\
`RegisterDto` --> `User`\
Spring Security authorities --> permission strings

The mapper uses MapStruct, which automatically generates the code needed to perform the conversions.

### @Mapper(componentModel = "spring")
`@Mapper(componentModel = "spring")`

This tells MapStruct that `UserMapper` is a mapper interface.

`componentModel = "spring"` makes the generated mapper a Spring Bean, allowing it to be used by other Spring components through dependency injection.

### INSTANCE :
```java
UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
```
^ Gets the implementation of `UserMapper` generated by MapStruct ^

It allows the mapper to be accessed using:

`UserMapper.INSTANCE`

However, because the mapper uses `componentModel = "spring"`, it can also be managed directly by Spring.

### toUserDto() :
```java
UserDto toUserDto(User user);
```

^ Converts a `User` Entity into a `UserDto` ^

It maps the basic user information:

- id
- firstName
- lastName
- login
- deleted

It also converts the user's roles and permissions into the format expected by the DTO.

### mainRole :
```java
@Mapping(
    target = "mainRole",
    expression = "java(user.getMainRole().getName().name())"
)
```


^ Gets the name of the user's main role and stores it as a string in the DTO ^

### appSpecificRoles :
```java
@Mapping(
    target = "appSpecificRoles",
    expression = "java(user.getAppSpecificRolesString().stream().sorted().toList())"
)
```

^ Gets the user's application-specific roles, sorts them, and converts them into a list of strings ^

### permissions :
```java
@Mapping(
    target = "permissions",
    source = "authorities",
    qualifiedByName = "authoritiesToPermissions"
)
```

^ Converts the user's Spring Security authorities into a list of permission strings ^

The `qualifiedByName` tells MapStruct to use the authoritiesToPermissions() method for this conversion.

### token
```java
@Mapping(target = "token", ignore = true)
```

^ The `token` field is ignored by the mapper ^

The authentication token is handled separately by the authentication system.

### signUpToUser()

```java
 User signUpToUser(RegisterDto registerDto);
```

^ Converts a `RegisterDto` into a new `User` Entity ^

It is mainly used when creating a user from registration information.

Some fields are intentionally ignored because they are managed by the application instead of coming from the registration form.

Ignored fields:

- mainRole
- appSpecificRoles
- deleted
- id
- createdAt
- updatedAt

For example, the user's ID and timestamps are generated by the system, while roles are assigned separately.

### authoritiesToPermissions()
```java
@Named("authoritiesToPermissions")
default List<String> authoritiesToPermissions(
    Collection<? extends GrantedAuthority> authorities
)
```

^ Converts Spring Security's `GrantedAuthority` objects into a list of strings. ^

The method uses a Java Stream to process every authority:

```java
return authorities.stream()
    .map(auth -> auth.getAuthority())
    .collect(Collectors.toList());
```

This means that each GrantedAuthority is converted into its string representation and then stored in a List<String>.

If authorities is null, the method returns null.

### Mapping overview

The `UserMapper` therefore handles the following conversions:

`RegisterDto` --> `signUpToUser()` --> `User`


`User` --> `toUserDto()` --> `UserDto`


`GrantedAuthority` --> `authoritiesToPermissions()` --> `permission String`

This keeps the conversion logic separate from the Controller and Service, making the code easier to maintain.

---



## *UserRepository.java*

`UserRepository` is the repository used to access and modify `User` entities in the database.

It extends `JpaRepository`, which gives it common database operations such as:

* Create
* Find
* Update
* Delete

It also contains custom methods for searching users and managing soft-deleted users.

`UserRepository` also extends `UserRepositoryPermanentDelete`, which provides functionality for permanently deleting users.

### JpaRepository<User, Long>

```java
public interface UserRepository
    extends JpaRepository<User, Long>, UserRepositoryPermanentDelete
```

`User` is the Entity that this repository works with.

`Long` is the type of the user's ID.

By extending `JpaRepository`, the repository automatically gets standard methods such as:

```java
save()
findById()
findAll()
delete()
existsById()
```

This means these methods do not have to be manually implemented.

### findByLogin()

```java
Optional<User> findByLogin(String login);
```

^ Finds a user using their login ^

The result is an `Optional<User>`:

* contains the user if one is found
* is empty if no user is found

This method can be used for authentication, user lookup, and checking whether a user exists.

### findAllByDeletedFalse()

```java
List<User> findAllByDeletedFalse();
```

^ Returns all users where `deleted` is `false` ^

This is used to get users that have not been soft-deleted.

### findAllIncludingDeleted()

```java
@Query("SELECT u FROM User u")
List<User> findAllIncludingDeleted();
```

^ Returns all users from the database, including users that have been soft-deleted ^

The `@Query` annotation contains a JPQL query that selects every `User`.

### findAllDeleted()

```java
@Query("SELECT u FROM User u WHERE u.deleted = true")
List<User> findAllDeleted();
```

^ Returns only users whose `deleted` field is `true` ^

These are users that have been soft-deleted.

### restoreById()

```java
@Modifying
@Transactional
@Query("UPDATE User u SET u.deleted = false WHERE u.id = :id")
void restoreById(Long id);
```

^ Restores a soft-deleted user using their ID ^

It changes:

```java
deleted = true
```

to:

```java
deleted = false
```

`@Query` defines the database operation.

`@Modifying` tells Spring Data that the query modifies data instead of only retrieving it.

`@Transactional` makes sure the database operation is executed inside a transaction.

`:id` represents the ID provided to the method.

### existsByLogin()

```java
boolean existsByLogin(String login);
```

^ Checks whether a user with the given login already exists ^

It returns `true` or `false`.

This can be used to prevent duplicate user accounts during registration.

### Soft deletion

`UserRepository` supports the application's soft-deletion system.

Instead of immediately removing a user from the database, the user can be marked as deleted:

```java
deleted = true
```

This allows the application to:

- hide deleted users from normal user lists
- view deleted users when needed
- restore deleted users
- keep their database record

The methods related to this are:


- findAllByDeletedFalse()
- findAllIncludingDeleted()
- findAllDeleted()
- restoreById()

### Summary

| Method                      | Purpose                          |
| --------------------------- | -------------------------------- |
| `findByLogin()`             | Finds a user by their login      |
| `findAllByDeletedFalse()`   | Gets active users                |
| `findAllIncludingDeleted()` | Gets all users                   |
| `findAllDeleted()`          | Gets soft-deleted users          |
| `restoreById()`             | Restores a soft-deleted user     |
| `existsByLogin()`           | Checks if a login already exists |

The repository's main purpose is to provide the `UserService` with methods for communicating with the database without putting database logic directly inside the Controller or Service.

---



## *UserRepositoryImpl.java*

`UserRepositoryImpl` is the implementation of the custom methods defined in `UserRepositoryPermanentDelete`.

Its main purpose is to permanently delete a user from the database.

Unlike a soft delete, a permanent deletion removes the user's database records completely.

### @Repository

```java
@Repository
```

^ Marks this class as a Spring Repository ^

It tells Spring that this class is responsible for database-related operations.

### @Transactional

```java
@Transactional
```

^ Makes sure the database operations are executed inside a transaction ^

This is important because the method performs multiple delete operations. If an error occurs, the transaction can prevent the database from being left in an incomplete state.

### EntityManager

```java
@PersistenceContext
private EntityManager entityManager;
```

`EntityManager` is used to directly communicate with the database through JPA.

It is used here because the permanent deletion requires custom SQL queries.

### deletePermanentlyById()

```java
public void deletePermanentlyById(Long id)
```

^ Permanently deletes the user with the given ID ^

The method performs two deletion operations.

#### 1. Delete application-specific roles

```java
entityManager.createNativeQuery(
    "DELETE FROM users_app_specific_roles WHERE users_app_specifique_id = :id")
    .setParameter("id", id)
    .executeUpdate();
```

First, the user's entries in the `users_app_specific_roles` join table are deleted.

This is necessary because these entries may reference the user through a foreign key.

If they were not removed first, the database could prevent the user from being deleted because of the foreign key constraint.

#### 2. Delete the user

```java
entityManager.createNativeQuery(
    "DELETE FROM users WHERE id = :id")
    .setParameter("id", id)
    .executeUpdate();
```

After the related join-table entries have been removed, the user itself is permanently deleted from the `users` table.

### Deletion process

```text
User ID
   |
Delete user's app-specific role references
   |
Delete user from users table
```

This is different from a soft delete.

Soft delete:

```text
deleted = true
```

The database record remains.

Permanent deletion:

```text
DELETE FROM users
```

The database record is removed completely.

### Summary

`UserRepositoryImpl` provides the custom permanent-deletion functionality that cannot be handled directly by the standard `JpaRepository` methods.

It first removes the user's related records from the join table and then permanently removes the user from the database.

---



## *UserRepositoryPermanentDelete.java*

`UserRepositoryPermanentDelete` is a custom repository interface used for permanently deleting users from the database.

It defines the method needed for hard deletion without implementing the actual database operation.

### deletePermanentlyById()

```java id="x7p2ka"
void deletePermanentlyById(Long id);
```

Permanently deletes the user with the specified ID.

The method is only defined here. Its actual implementation is located in `UserRepositoryImpl`.

```text id="3p6mqa"
UserRepositoryPermanentDelete
        |
defines deletePermanentlyById()
        |
UserRepositoryImpl
        |
implements the method
        |
permanently deletes the user
```

### Why a separate interface?

`JpaRepository` already provides standard database operations, but permanent deletion in this project requires custom logic.

The separate interface allows this custom operation to be added to `UserRepository`:

```java
public interface UserRepository
    extends JpaRepository<User, Long>, UserRepositoryPermanentDelete
```

This gives `UserRepository` both the standard JPA operations and the custom permanent-deletion operation.

### Summary

`UserRepositoryPermanentDelete` defines the custom permanent-deletion method, while `UserRepositoryImpl` contains the code that actually performs it.

---



## *UserSeeder.java*

`UserSeeder` is used to automatically create default users in the database when the application starts.

It is mainly useful in the *development environment*, where predefined users are needed for testing.

The users are only created if the `users` table is empty.

### Annotations

#### @Component

```java
@Component
```

Registers `UserSeeder` as a Spring component.

This allows Spring Boot to detect and run the class when the application starts.

#### @Order(2)

```java
@Order(2)
```

Defines the order in which this seeder runs compared to other seeders.

`UserSeeder` runs after the `RoleSeeder`, which has a lower order number.

This is important because users need roles to exist before they can be created.

```text
RoleSeeder
    |
creates roles
    |
UserSeeder
    |
creates users
```

#### @Profile({"dev"})

```java
@Profile({ "dev" })
```

Limits this seeder to the `dev` Spring profile.

This means the default users are only created when the application is running in the development environment.

### CommandLineRunner

```java
public class UserSeeder implements CommandLineRunner
```

`CommandLineRunner` allows code to be executed automatically when the Spring Boot application starts.

The `run()` method is therefore called during application startup.

### Dependencies

`UserSeeder` uses two repositories:

* `UserRepository` --> used to create and access users
* `RoleRepository` --> used to find the roles that will be assigned to users

These repositories are provided through the constructor.

### run()

```java
@Override
public void run(String... args) throws Exception
```

This method is automatically executed when the application starts.

It:

1. displays a start message
2. calls `loadUserData()`
3. displays a completion message

### loadUserData()

```java
private void loadUserData()
```

This method creates the predefined users.

First, it checks whether the `users` table is empty:

```java
if (this.userRepository.count() == 0)
```

If the table is empty, the seeder loads the required roles from the database.

It retrieves:

* `USER`
* `MANAGER`
* `ADMIN`

If one of these roles does not exist, a `RuntimeException` is thrown.

### Creating users

Users are created using the `User.builder()` method.

For example:

```java
User user1 = User.builder()
        .firstName("John")
        .lastName("DOE")
        .login("john.doe@test.com")
        .mainRole(userRole)
        .build();
```

The builder is used to set the user's information and create the `User` object.

The seeded users have different main roles, including:

* regular `USER` accounts
* a `MANAGER` account
* `ADMIN` accounts

A predefined deleted user is also created for testing soft-deletion functionality.

### Saving the users

All created users are saved at once:

```java
userRepository.saveAll(
    Arrays.asList(user0, user1, user2, user3, user4,
                  user5, user6, user7, user8)
);
```

`saveAll()` stores the users in the database.

### If users already exist

If the users table is not empty, the seeder does not create the default users.

```java
else {
    System.out.println("Users table not empty - Skipping user seeding");
}
```

This prevents the default users from being recreated every time the application starts.

### Overall process

```text
Application starts
       |
UserSeeder.run()
       |
Check if users table is empty
       |
      YES
       |
Find USER / MANAGER / ADMIN roles
       |
Create predefined users
       |
Save users to database
```

If users already exist:

```text
Users already exist
       |
Skip user seeding
```

### Summary

`UserSeeder` initializes the database with predefined users for development and testing.

It runs only with the `dev` profile and runs after the role seeder. It checks whether users already exist before creating them, preventing duplicate default users.

---



## *UserService.java*

`UserService` contains the main business logic for managing users.

It is used by the `UserController` to perform operations such as:

* Creating users
* Finding users
* Updating users
* Deleting users
* Restoring users
* Managing user roles
* Synchronizing users with the authentication service

The `UserService` communicates with the repositories to access the database and uses `UserMapper` to convert between `User` Entities and `UserDto` objects.

### Annotations

#### @Service

```java
@Service
```

Marks the class as a Spring Service.

It tells Spring that this class contains application/business logic and can be injected into other components.

#### @RequiredArgsConstructor

```java
@RequiredArgsConstructor
```

This Lombok annotation automatically creates a constructor containing all `final` fields.

This is used for dependency injection.

The following dependencies are therefore automatically provided through the constructor:

* `UserRepository`
* `RoleRepository`
* `AuthClient`
* `UserMapper`

#### @Slf4j

```java
@Slf4j
```

Creates a logger called `log`.

It is used in the service to record information about operations, such as searching for a user.

### Dependencies

* `UserRepository` --> accesses and modifies users in the database.
* `RoleRepository` --> finds roles in the database.
* `AuthClient` --> communicates with the authentication service.
* `UserMapper` --> converts between `User` and `UserDto`.

---

# User retrieval

### allUsers()

```java
public List<UserDto> allUsers()
```

Retrieves all users that have not been soft-deleted.

It gets the users using:

```java
userRepository.findAllByDeletedFalse()
```

Each `User` is then converted into a `UserDto` using `UserMapper`.

```text
Database
   |
UserRepository
   |
List<User>
   |
UserMapper
   |
List<UserDto>
```

### allWithDeletedUsers()

```java
public List<UserDto> allWithDeletedUsers()
```

Retrieves all users, including soft-deleted users.

It uses:

```java
userRepository.findAllIncludingDeleted()
```

The users are then converted into `UserDto` objects.

### deletedUsers()

```java
public List<UserDto> deletedUsers()
```

Retrieves only users that have been soft-deleted.

It uses:

```java
userRepository.findAllDeleted()
```

### me()

```java
public UserDto me(UserDto currentUser)
```

Retrieves the currently authenticated user's information.

It uses the login from `currentUser` to search for the corresponding user in the database.

If the user cannot be found, a `UserNotFoundByLoginException` is thrown.

---

## User creation

### register()

```java
public User register(RegisterDto registerDto)
```

Creates a new user from registration information.

The method performs several checks before saving the user.

#### 1. Validate required fields

The login, first name, and last name must not be empty.

If a required field is missing, a `UserValidationException` is thrown.

#### 2. Check for duplicate login

The service checks whether another user already has the same login.

```java
userRepository.findByLogin(registerDto.login())
```

If a user already exists, a `DuplicateUserException` is thrown.

#### 3. Convert the DTO

```java
User user = userMapper.signUpToUser(registerDto);
```

The `RegisterDto` is converted into a `User` Entity.

#### 4. Assign the main role

If no main role is provided, the `USER` role is assigned by default.

If a role is provided, the service searches for that role in the database.

If the role does not exist, a `RoleNotFoundException` is thrown.

#### 5. Assign app-specific roles

If application-specific roles are provided, they are searched for in the database and added to the user.

#### 6. Save the user

```java
userRepository.save(user);
```

The new user is then saved to the database.

---

## Authenticated user sync

### getOrCreateAuthenticatedUser()

```java
public User getOrCreateAuthenticatedUser(UserDto userDto)
```

Checks whether an authenticated user already exists in the local database.

If the user exists, the existing user is returned.

If the user does not exist, a `RegisterDto` is created from the authenticated user's information and the user is registered locally.

```text
Authenticated user
       |
Check local database
       |
   Exists?
   /     \
 YES      NO
 |        |
Return   Register
user       |
         Save user
```

---

## Role management

### promoteToLocalManagerRole()

```java
public UserDto promoteToLocalManagerRole(Long userId)
```

Adds the `LOCAL_MANAGER` to a user.

The method:

1. searches for the user
2. checks whether the user already has the role
3. finds the role in the database
4. adds the role to the user's app-specific roles
5. saves the user
6. returns the updated `UserDto`

If the user already has the role, a `UserAlreadyHasRoleException` is thrown.

### updateMainRole()

```java
public void updateMainRole(User localUser, UserDto currentUser)
```

Checks whether the user's local main role is different from the role received from the authenticated user.

If it is different, the correct role is retrieved from the database and assigned to the user.

The modified user is then saved.

### getRolesList()

```java
public List<String> getRolesList(User localUser)
```

Creates a list containing all roles assigned to a user.

It adds:

* application-specific roles
* the user's main role

The result is a simple `List<String>` containing the user's roles.

---

# User deletion

The service supports both soft deletion and permanent deletion.

### deleteUser()

```java
public UserDto deleteUser(Long userId)
```

Deletes a user using their ID.

It first checks that the user exists and then calls:

```java
userRepository.deleteById(userId);
```

In this project, the `User` Entity uses soft deletion, so this does not necessarily remove the database record permanently.

### deleteUserPermanent()

```java
public UserDto deleteUserPermanent(Long userId)
```

Permanently deletes a user using their ID.

It uses the custom repository method:

```java
userRepository.deletePermanentlyById(userId);
```

This completely removes the user's database record.

### deleteUserByLogin()

```java
public UserDto deleteUserByLogin(String login)
```

Finds a user using their login and then performs a normal deletion.

### deleteUserPermanentByLogin()

```java
public UserDto deleteUserPermanentByLogin(String login)
```

Finds a user using their login and permanently deletes them.

---

# Global and local deletion

### deleteGlobalAndLocal()

```java
public Mono<String> deleteGlobalAndLocal(String token, Long userId)
```

Deletes a user from both the global authentication service and the local database.

First, it calls:

```java
authClient.deleteGlobalUser(...)
```

After receiving the response, it gets the deleted user's login.

It then uses that login to delete the local user.

The method returns a `Mono<String>` containing the deletion message.

### deleteGlobalAndLocalPermanent()

```java
public Mono<String> deleteGlobalAndLocalPermanent(
    String token,
    Long userId,
    Boolean hardDelete
)
```

Performs the same global/local synchronization but uses the permanent deletion method.

It calls the authentication service to permanently delete the global user and then permanently deletes the corresponding local user.

`Mono<String>` is used because the communication with the authentication service is reactive/asynchronous.

---

# Finding a user

### findByLogin()

```java
public UserDto findByLogin(String login)
```

Searches for a user using their login.

The method:

1. searches the database
2. checks whether the user exists
3. checks whether the user is soft-deleted
4. converts the `User` Entity into a `UserDto`
5. returns the DTO

If the user does not exist, `UserNotFoundByLoginException` is thrown.

If the user is deleted, `InactiveUserException` is thrown.

The method also uses `log` to record information about the search.

---

# User update

### updateUser()

```java
public void updateUser(Long userId, UserDto newUser)
```

Updates an existing user's information.

First, it finds the existing user using the ID.

It then retrieves and validates the new main role and app-specific roles.

The following information can be updated:

* first name
* last name
* login
* main role
* app-specific roles

Finally, the modified `User` Entity is saved using `userRepository.save()`.

---

# User restoration

### restoreUser()

```java
public void restoreUser(String userLogin, String token)
```

Restores a soft-deleted user.

It first calls `authClient.restoreGlobalUser()` (`PUT /users/{login}/restore` on spring-auth) to restore the global user (no error if it was not soft-deleted). A 404 from spring-auth means the global user does not exist and is thrown as a `UserNotFoundException`; any other error is thrown as a `UserUpdateException`. In both cases the local user is left unchanged.

It then finds the local user and changes:

```text
deleted = true
```

to:

```text
deleted = false
```

The modified user is then saved.

A permanently deleted user cannot be restored because its database record no longer exists.

---

# Get or create user

### getOrCreateUser()

```java
public UserDto getOrCreateUser(UserDto userDto)
```

Checks whether a user already exists using their login.

It also retrieves the user's main role from the database.

If the user does not exist, a new `User` is created using:

* first name
* last name
* login
* main role
* app-specific roles

The new user is saved and converted into a `UserDto`.

If the user already exists, the existing user is simply converted into a `UserDto`.

---

# Exception handling

`UserService` uses the custom exceptions defined in `UserExceptions.java`.

Examples include:

* `UserNotFoundException` --> user does not exist
* `DuplicateUserException` --> login is already used
* `RoleNotFoundException` --> requested role does not exist
* `UserCreationException` --> user creation fails
* `UserUpdateException` --> user update fails
* `UserDeletionException` --> user deletion fails
* `PermanentUserDeletionException` --> permanent deletion fails
* `InactiveUserException` --> action is attempted on an inactive/deleted user

Many methods use `try/catch` blocks to preserve specific exceptions and convert unexpected errors into an appropriate user-related exception.

---

# Overall structure

`UserService` sits between the Controller and the repositories/services:

```text
UserController
      |
  UserService
   /    |    \
UserRepository  RoleRepository  AuthClient
      |              |             |
   Database        Roles      Auth Service
```

`UserMapper` is also used by the service when user information needs to be converted:

```text
User Entity
     |
UserMapper
     |
UserDto
```

### Summary

`UserService` contains the main logic for user management.

It handles:

| Function                       | Main methods                                                             |
| ------------------------------ | ------------------------------------------------------------------------ |
| User retrieval                 | `allUsers()`, `allWithDeletedUsers()`, `deletedUsers()`, `findByLogin()` |
| User creation                  | `register()`, `getOrCreateUser()`                                        |
| Authentication synchronization | `getOrCreateAuthenticatedUser()`                                         |
| Role management                | `promoteToLocalManagerRole()`, `updateMainRole()`, `getRolesList()`          |
| User update                    | `updateUser()`                                                           |
| Soft deletion                  | `deleteUser()`, `deleteUserByLogin()`                                    |
| Permanent deletion             | `deleteUserPermanent()`, `deleteUserPermanentByLogin()`                  |
| Restoration                    | `restoreUser()`                                                          |
| Global/local synchronization   | `deleteGlobalAndLocal()`, `deleteGlobalAndLocalPermanent()`              |

Overall, `UserService` keeps the user-related business logic out of the Controller and coordinates the repositories, authentication service, and mapper.
