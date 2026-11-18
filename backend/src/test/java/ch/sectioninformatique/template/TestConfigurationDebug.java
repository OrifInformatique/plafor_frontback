package ch.sectioninformatique.template;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class TestConfigurationDebug {

    @Autowired
    private Environment env;

    @Test
    void debugConfiguration() {
        try {
            System.out.println("Active profiles: " + String.join(", ", env.getActiveProfiles()));
            System.out.println("Database URL: " + env.getProperty("spring.datasource.url"));
            System.out.println("Database Username: " + env.getProperty("spring.datasource.username"));
            System.out.println("Database Password: " + env.getProperty("spring.datasource.password"));
            System.out.println("Hibernate DDL Auto: " + env.getProperty("spring.jpa.hibernate.ddl-auto"));
        } catch (Exception e) {
            System.err.println("Error during test: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}