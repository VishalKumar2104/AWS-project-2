package com.hirehub.controller;

import com.hirehub.dto.response.ApplicationResponse;
import com.hirehub.entity.Application;
import com.hirehub.entity.ApplicationStatusHistory;
import com.hirehub.entity.JobSeekerProfile;
import com.hirehub.entity.User;
import com.hirehub.enums.ApplicationStatus;
import com.hirehub.repository.ApplicationRepository;
import com.hirehub.repository.ApplicationStatusHistoryRepository;
import com.hirehub.repository.JobSeekerProfileRepository;
import com.hirehub.repository.UserRepository;
import com.hirehub.security.FirebasePrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Slf4j
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final UserRepository userRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;

    /**
     * GET /api/v1/applications/me
     * Get applications submitted by current job seeker.
     */
    @GetMapping("/me")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal FirebasePrincipal principal
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        User user = userRepository.findByFirebaseUid(principal.getUid())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(user.getId())
                .orElse(null);

        if (profile == null) {
            return ResponseEntity.ok(List.of());
        }

        List<Application> apps = applicationRepository.findByJobSeekerProfileIdOrderByCreatedAtDesc(profile.getId());
        return ResponseEntity.ok(apps.stream().map(ApplicationResponse::fromEntity).toList());
    }

    /**
     * PATCH /api/v1/applications/{id}/withdraw
     * Job seeker withdraws their application.
     */
    @PatchMapping("/{id}/withdraw")
    public ResponseEntity<ApplicationResponse> withdrawApplication(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @PathVariable Long id
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        application.setStatus(ApplicationStatus.WITHDRAWN);
        Application saved = applicationRepository.save(application);

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(saved)
                .status(ApplicationStatus.WITHDRAWN)
                .changedBy(principal.getEmail() != null ? principal.getEmail() : principal.getUid())
                .changedAt(LocalDateTime.now())
                .notes("Application withdrawn by candidate")
                .build();
        statusHistoryRepository.save(history);

        return ResponseEntity.ok(ApplicationResponse.fromEntity(saved));
    }
}
