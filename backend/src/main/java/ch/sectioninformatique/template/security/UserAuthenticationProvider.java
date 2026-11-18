package ch.sectioninformatique.template.security;

import java.util.Base64;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;

import ch.sectioninformatique.template.security.SecurityExceptions.InvalidJwtSignatureException;
import ch.sectioninformatique.template.security.SecurityExceptions.InvalidTokenException;
import ch.sectioninformatique.template.security.SecurityExceptions.InvalidTokenTypeException;
import ch.sectioninformatique.template.security.SecurityExceptions.JwtTokenExpiredException;
import ch.sectioninformatique.template.security.SecurityExceptions.JwtVerificationException;
import ch.sectioninformatique.template.security.SecurityExceptions.MalformedJwtException;
import ch.sectioninformatique.template.user.User;
import ch.sectioninformatique.template.user.UserDto;
import ch.sectioninformatique.template.user.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Provider class for handling user authentication using JWT tokens.
 * This class is responsible for:
 * - Creating and validating JWT tokens
 * - Managing user authentication
 * - Converting user roles and permissions into Spring Security authorities
 */
@Slf4j
@RequiredArgsConstructor
@Component

public class UserAuthenticationProvider {

    private final UserService userService;

    /**
     * Secret key for JWT token signing and verification, configured via environment
     * variable.
     */
    @Value("${SECURITY_JWT_TOKEN_SECRET_KEY}")
    private String secretKey;

    /**
     * Initializes the authentication provider by encoding the secret key.
     * This method is called after dependency injection to ensure the secret key
     * is properly encoded before use. The encoding helps prevent the raw secret key
     * from being available in the JVM memory.
     */
    @PostConstruct
    protected void init() {
        // this is to avoid having the raw secret key available in the JVM
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    /**
     * Creates a JWT token for a user with their information and permissions.
     * The token includes:
     * - User login as subject
     * - First name and last name as claims
     * - Main role and permissions as claims, like a spring-auth token
     * - Issue time and expiration time (1 hour validity)
     *
     * @param user The user to create a token for
     * @return A JWT token string containing the user's information and permissions
     */
    public String createToken(UserDto user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3600000); // 1 hour

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(user.getLogin())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("firstName", user.getFirstName())
                .withClaim("lastName", user.getLastName())
                .withClaim("mainRole", user.getMainRole())
                .withClaim("permissions", user.getPermissions())
                .sign(algorithm);
    }

    /**
     * Creates a JWT token for a user with their information and permissions.
     * The token includes:
     * - User login as subject
     * - First name and last name as claims
     * - Role and permissions as claims
     * - Issue time and expiration time (1 hour validity)
     *
     * @param user The user to create a token for
     * @return A JWT token string containing the user's information and permissions
     */
    public String createToken(UserDto user, Date... testDate) {
        Date now = testDate.length > 0 ? testDate[0] : new Date();
        Date validity = new Date(now.getTime() + 3600000); // 1 hour

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(user.getLogin())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("typ", "access")
                .withClaim("firstName", user.getFirstName())
                .withClaim("lastName", user.getLastName())
                .withClaim("mainRole", user.getMainRole())
                .withClaim("permissions", user.getPermissions())
                .sign(algorithm);
    }

    /**
     * Validates a JWT token and creates an Authentication object.
     * This method performs basic token validation without checking the database.
     * It verifies:
     * - Token signature using the secret key
     * - Token expiration
     * - Token claims (user information)
     * 
     * The resulting authorities are the global permissions granted by spring-auth
     * (token {@code permissions} claim) merged with the local permissions of the
     * user's main role ({@link MainRoleEnum}) and app-specific roles
     * ({@link LocalRoleEnum}).
     *
     * It also modify the local informations based on the the validated token
     * informations
     * - It add new validated user
     * - it update main Roles for users
     *
     * @param token The JWT token to validate
     * @return Authentication object containing the user's information and
     *         authorities
     * @throws JwtTokenExpiredException if the token has expired
     * @throws InvalidJwtSignatureException if the token signature is invalid
     * @throws JwtVerificationException if token verification fails
     * @throws MalformedJwtException if the token is malformed
     * @throws InvalidTokenTypeException if the token type is invalid
     */
    public Authentication validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            JWTVerifier verifier = JWT.require(algorithm)
                    .build();

            DecodedJWT decoded = verifier.verify(token);
            log.debug("Token verified for subject: {}", decoded.getSubject());

            String type = decoded.getClaim("typ").asString();

            if (type != null && !"access".equals(type)) {
                throw new InvalidTokenTypeException();
            }

            UserDto currentUser = UserDto.builder()
                    .login(decoded.getSubject())
                    .firstName(decoded.getClaim("firstName").asString())
                    .lastName(decoded.getClaim("lastName").asString())
                    .mainRole(decoded.getClaim("mainRole").asString())
                    .permissions(decoded.getClaim("permissions").asList(String.class))
                    .build();

            User localUser = userService.getOrCreateAuthenticatedUser(currentUser);

            userService.updateMainRole(localUser, currentUser);

            // Global permissions are granted by spring-auth in the token "permissions"
            // claim. Local permissions come from the synced local user: those of its
            // main role (MainRoleEnum) plus those of its app-specific roles.
            Set<GrantedAuthority> authorities = new HashSet<>(localUser.getAuthorities());
            if (currentUser.getPermissions() != null) {
                currentUser.getPermissions().stream()
                        .map(SimpleGrantedAuthority::new)
                        .forEach(authorities::add);
            }

            return new UsernamePasswordAuthenticationToken(currentUser, null, authorities);
        } catch (TokenExpiredException e) {
            log.warn("JWT token has expired");
            throw new JwtTokenExpiredException();
        } catch (SignatureVerificationException e) {
            log.warn("Invalid JWT signature: {}", e.getMessage());
            throw new InvalidJwtSignatureException();
        } catch (com.auth0.jwt.exceptions.JWTVerificationException e) {
            log.warn("JWT verification failed: {}", e.getMessage());
            throw new JwtVerificationException(e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Malformed JWT token: {}", e.getMessage());
            throw new MalformedJwtException(e.getMessage());
        } catch (InvalidTokenTypeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during token validation: {}", e.getMessage(), e);
            throw new InvalidTokenException(e.getMessage());
        }
    }

}