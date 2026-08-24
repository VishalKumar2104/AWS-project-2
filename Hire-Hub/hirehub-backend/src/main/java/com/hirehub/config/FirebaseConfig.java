package com.hirehub.config;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Base64;
import java.util.Date;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.service-account-path:#{null}}")
    private String serviceAccountPath;

    @Value("${FIREBASE_SERVICE_ACCOUNT_BASE64:#{null}}")
    private String serviceAccountBase64;

    @Value("${firebase.project-id:hire-hub-f9a99}")
    private String projectId;

    @Bean
    public FirebaseApp firebaseApp() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        GoogleCredentials credentials = null;

        try {
            if (serviceAccountBase64 != null && !serviceAccountBase64.isBlank()) {
                log.info("Initializing Firebase from base64 env variable");
                byte[] decoded = Base64.getDecoder().decode(serviceAccountBase64);
                try (InputStream is = new ByteArrayInputStream(decoded)) {
                    credentials = GoogleCredentials.fromStream(is);
                }
            } else if (serviceAccountPath != null && !serviceAccountPath.isBlank()) {
                String path = serviceAccountPath.replace("classpath:", "");
                Resource resource = new ClassPathResource(path);
                if (resource.exists()) {
                    log.info("Initializing Firebase from classpath file: {}", path);
                    try (InputStream is = resource.getInputStream()) {
                        credentials = GoogleCredentials.fromStream(is);
                    }
                } else {
                    log.warn("Firebase service account file not found at [{}]. Using mock development credentials...", path);
                }
            }
        } catch (Exception e) {
            log.warn("Could not load configured Firebase credentials: {}. Falling back to mock credentials.", e.getMessage());
        }

        if (credentials == null) {
            try {
                credentials = GoogleCredentials.getApplicationDefault();
            } catch (Exception e) {
                // Fallback mock credentials for local dev
                credentials = GoogleCredentials.create(
                        new AccessToken("mock-dev-token", new Date(System.currentTimeMillis() + 864000000000L))
                );
                log.info("Initialized Firebase with development credentials for projectId: {}", projectId);
            }
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setProjectId(projectId)
                .setCredentials(credentials)
                .build();

        return FirebaseApp.initializeApp(options);
    }
}
