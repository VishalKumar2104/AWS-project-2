package com.hirehub.controller;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.hirehub.entity.Company;
import com.hirehub.entity.JobSeekerProfile;
import com.hirehub.entity.User;
import com.hirehub.enums.Role;
import com.hirehub.repository.CompanyRepository;
import com.hirehub.repository.JobSeekerProfileRepository;
import com.hirehub.repository.UserRepository;
import com.hirehub.security.FirebasePrincipal;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final CompanyRepository companyRepository;

    /**
     * GET /api/v1/users/me
     * Auto-creates the DB user record on first login (based on Firebase UID).
     * Returns the user's profile data.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal FirebasePrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        // Find or create user record
        User user = userRepository.findByFirebaseUid(principal.getUid())
                .orElseGet(() -> {
                    log.info("Creating new DB user for Firebase UID: {}", principal.getUid());
                    User newUser = User.builder()
                            .firebaseUid(principal.getUid())
                            .email(principal.getEmail())
                            .role(Role.valueOf(principal.getRole()))
                            .isEnabled(true)
                            .build();
                    return userRepository.save(newUser);
                });

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("firebaseUid", user.getFirebaseUid());

        if (user.getRole() == Role.ROLE_JOB_SEEKER) {
            jobSeekerProfileRepository.findByUserId(user.getId())
                    .ifPresent(p -> {
                        response.put("profileId", p.getId());
                        response.put("firstName", p.getFirstName());
                        response.put("lastName", p.getLastName());
                    });
        } else if (user.getRole() == Role.ROLE_RECRUITER) {
            companyRepository.findByUserId(user.getId())
                    .ifPresent(c -> {
                        response.put("companyId", c.getId());
                        response.put("companyName", c.getName());
                    });
        }

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/users/me/setup
     * Called after Firebase registration to set the user's role and create their profile/company.
     * Also sets a custom "role" claim on the Firebase token so it's available in subsequent requests.
     */
    @PostMapping("/me/setup")
    public ResponseEntity<?> setupUser(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @RequestBody @Valid SetupRequest request) {

        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        Role role = Role.valueOf(request.role());

        // Upsert user record
        User user = userRepository.findByFirebaseUid(principal.getUid())
                .orElseGet(() -> User.builder()
                        .firebaseUid(principal.getUid())
                        .email(principal.getEmail())
                        .isEnabled(true)
                        .build());
        user.setRole(role);
        user = userRepository.save(user);

        // Set custom role claim on Firebase token so future tokens carry the role
        try {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", role.name());
            FirebaseAuth.getInstance(FirebaseApp.getInstance())
                    .setCustomUserClaims(principal.getUid(), claims);
            log.info("Set custom claim role={} for uid={}", role, principal.getUid());
        } catch (Exception e) {
            log.error("Failed to set Firebase custom claim: {}", e.getMessage());
        }

        // Create profile or company record
        if (role == Role.ROLE_JOB_SEEKER) {
            if (jobSeekerProfileRepository.findByUserId(user.getId()).isEmpty()) {
                JobSeekerProfile profile = new JobSeekerProfile();
                profile.setUser(user);
                if (request.firstName() != null) profile.setFirstName(request.firstName());
                if (request.lastName() != null) profile.setLastName(request.lastName());
                jobSeekerProfileRepository.save(profile);
            }
        } else if (role == Role.ROLE_RECRUITER) {
            if (companyRepository.findByUserId(user.getId()).isEmpty()) {
                Company company = new Company();
                company.setUser(user);
                company.setName(request.companyName() != null ? request.companyName() : "My Company");
                companyRepository.save(company);
            }
        }

        return ResponseEntity.ok(Map.of(
                "message", "Account setup complete",
                "role", role.name(),
                "uid", principal.getUid()
        ));
    }

    record SetupRequest(
            @NotBlank String role,
            String firstName,
            String lastName,
            String companyName
    ) {}
}
