package com.hirehub.controller;

import com.hirehub.dto.request.UpdateStatusRequest;
import com.hirehub.dto.response.ApplicationResponse;
import com.hirehub.dto.response.JobResponse;
import com.hirehub.entity.*;
import com.hirehub.repository.*;
import com.hirehub.security.FirebasePrincipal;
import jakarta.validation.Valid;
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
@RequestMapping("/api/v1/recruiter")
@RequiredArgsConstructor
@Slf4j
public class RecruiterController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;

    /**
     * GET /api/v1/recruiter/jobs
     * List all jobs posted by the logged-in recruiter's company.
     */
    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getMyJobs(@AuthenticationPrincipal FirebasePrincipal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        User user = userRepository.findByFirebaseUid(principal.getUid())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Company company = companyRepository.findByUserId(user.getId())
                .orElse(null);

        if (company == null) {
            return ResponseEntity.ok(List.of());
        }

        List<Job> jobs = jobRepository.findByCompanyIdOrderByCreatedAtDesc(company.getId());
        return ResponseEntity.ok(jobs.stream().map(JobResponse::fromEntity).toList());
    }

    /**
     * GET /api/v1/recruiter/jobs/{jobId}/applications
     * List all applications received for a specific job.
     */
    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<ApplicationResponse>> getJobApplications(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @PathVariable Long jobId
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        List<Application> applications = applicationRepository.findByJobIdOrderByCreatedAtDesc(jobId);
        return ResponseEntity.ok(applications.stream().map(ApplicationResponse::fromEntity).toList());
    }

    /**
     * PATCH /api/v1/recruiter/applications/{applicationId}/status
     * Update status of an applicant (SHORTLISTED, REJECTED, HIRED, etc.)
     */
    @PatchMapping("/applications/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @PathVariable Long applicationId,
            @RequestBody @Valid UpdateStatusRequest request
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        application.setStatus(request.getStatus());
        Application saved = applicationRepository.save(application);

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(saved)
                .status(request.getStatus())
                .changedBy(principal.getEmail() != null ? principal.getEmail() : principal.getUid())
                .changedAt(LocalDateTime.now())
                .notes(request.getNotes())
                .build();
        statusHistoryRepository.save(history);

        return ResponseEntity.ok(ApplicationResponse.fromEntity(saved));
    }
}
