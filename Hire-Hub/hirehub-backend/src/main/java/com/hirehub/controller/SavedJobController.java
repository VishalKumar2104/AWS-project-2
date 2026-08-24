package com.hirehub.controller;

import com.hirehub.dto.response.JobResponse;
import com.hirehub.entity.Job;
import com.hirehub.entity.JobSeekerProfile;
import com.hirehub.entity.SavedJob;
import com.hirehub.entity.User;
import com.hirehub.repository.JobRepository;
import com.hirehub.repository.JobSeekerProfileRepository;
import com.hirehub.repository.SavedJobRepository;
import com.hirehub.repository.UserRepository;
import com.hirehub.security.FirebasePrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/saved-jobs")
@RequiredArgsConstructor
@Slf4j
public class SavedJobController {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final UserRepository userRepository;

    /**
     * GET /api/v1/saved-jobs
     * Get all saved jobs for current job seeker.
     */
    @GetMapping
    public ResponseEntity<List<JobResponse>> getSavedJobs(
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

        List<SavedJob> savedJobs = savedJobRepository.findByJobSeekerProfileIdOrderByCreatedAtDesc(profile.getId());
        List<JobResponse> jobs = savedJobs.stream()
                .filter(saved -> saved != null && saved.getJob() != null)
                .map(saved -> JobResponse.fromEntity(saved.getJob()))
                .toList();

        return ResponseEntity.ok(jobs);
    }

    /**
     * POST /api/v1/saved-jobs/{jobId}
     * Save a job for later.
     */
    @PostMapping("/{jobId}")
    public ResponseEntity<?> saveJob(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @PathVariable Long jobId
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        User user = userRepository.findByFirebaseUid(principal.getUid())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    JobSeekerProfile p = JobSeekerProfile.builder().user(user).build();
                    return jobSeekerProfileRepository.save(p);
                });

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        if (!savedJobRepository.existsByJobIdAndJobSeekerProfileId(job.getId(), profile.getId())) {
            SavedJob savedJob = SavedJob.builder()
                    .job(job)
                    .jobSeekerProfile(profile)
                    .build();
            savedJobRepository.save(savedJob);
        }

        return ResponseEntity.ok(Map.of("message", "Job saved successfully"));
    }

    /**
     * DELETE /api/v1/saved-jobs/{jobId}
     * Unsave a job.
     */
    @DeleteMapping("/{jobId}")
    @Transactional
    public ResponseEntity<?> unsaveJob(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @PathVariable Long jobId
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        User user = userRepository.findByFirebaseUid(principal.getUid())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(user.getId())
                .orElse(null);

        if (profile != null) {
            savedJobRepository.deleteByJobIdAndJobSeekerProfileId(jobId, profile.getId());
        }

        return ResponseEntity.ok(Map.of("message", "Job removed from saved list"));
    }
}
