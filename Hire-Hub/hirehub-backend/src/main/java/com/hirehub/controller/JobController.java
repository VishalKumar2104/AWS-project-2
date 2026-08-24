package com.hirehub.controller;

import com.hirehub.dto.request.ApplyJobRequest;
import com.hirehub.dto.request.JobCreateRequest;
import com.hirehub.dto.response.ApplicationResponse;
import com.hirehub.dto.response.JobResponse;
import com.hirehub.dto.response.PageResponse;
import com.hirehub.entity.*;
import com.hirehub.enums.ApplicationStatus;
import com.hirehub.enums.JobStatus;
import com.hirehub.enums.JobType;
import com.hirehub.repository.*;
import com.hirehub.security.FirebasePrincipal;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final com.hirehub.service.RapidApiJobService rapidApiJobService;

    /**
     * GET /api/v1/jobs/external
     * Real-time live jobs fetched via RapidAPI (JSearch).
     */
    @GetMapping("/external")
    public ResponseEntity<List<JobResponse>> getExternalJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<JobResponse> liveJobs = rapidApiJobService.searchLiveJobs(keyword, location, jobType, page, size);
        return ResponseEntity.ok(liveJobs);
    }

    /**
     * GET /api/v1/jobs
     * Public searchable and pageable job list.
     */
    @GetMapping
    public ResponseEntity<PageResponse<JobResponse>> getJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), JobStatus.ACTIVE));

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate skillsMatch = cb.like(cb.lower(root.get("skillsRequired")), pattern);
                predicates.add(cb.or(titleMatch, descMatch, skillsMatch));
            }

            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }

            if (jobType != null && !jobType.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("jobType"), JobType.valueOf(jobType)));
                } catch (IllegalArgumentException ignored) {}
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Job> jobPage = jobRepository.findAll(spec, pageable);
        return ResponseEntity.ok(PageResponse.fromPage(jobPage, JobResponse::fromEntity));
    }

    /**
     * GET /api/v1/jobs/{id}
     * Public view single job details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        if (id != null && id >= 100000L) {
            JobResponse externalJob = rapidApiJobService.getExternalJobById(id);
            if (externalJob != null) {
                return ResponseEntity.ok(externalJob);
            }
        }

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        return ResponseEntity.ok(JobResponse.fromEntity(job));
    }

    /**
     * POST /api/v1/jobs
     * Recruiter creates a new job posting.
     */
    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @RequestBody @Valid JobCreateRequest request
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        User user = userRepository.findByFirebaseUid(principal.getUid())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Company company = companyRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Company newComp = Company.builder()
                            .user(user)
                            .name("My Company")
                            .build();
                    return companyRepository.save(newComp);
                });

        Job job = Job.builder()
                .company(company)
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .skillsRequired(request.getSkillsRequired())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.ACTIVE)
                .build();

        Job saved = jobRepository.save(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(JobResponse.fromEntity(saved));
    }

    /**
     * PUT /api/v1/jobs/{id}
     * Recruiter updates an existing job posting.
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @PathVariable Long id,
            @RequestBody JobCreateRequest request
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements());
        if (request.getSkillsRequired() != null) job.setSkillsRequired(request.getSkillsRequired());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getJobType() != null) job.setJobType(request.getJobType());
        if (request.getSalaryMin() != null) job.setSalaryMin(request.getSalaryMin());
        if (request.getSalaryMax() != null) job.setSalaryMax(request.getSalaryMax());
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        Job updated = jobRepository.save(job);
        return ResponseEntity.ok(JobResponse.fromEntity(updated));
    }

    /**
     * DELETE /api/v1/jobs/{id}
     * Soft delete job.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @PathVariable Long id
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        job.setDeletedAt(LocalDateTime.now());
        job.setStatus(JobStatus.CLOSED);
        jobRepository.save(job);

        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }

    /**
     * POST /api/v1/jobs/{id}/apply
     * Job seeker submits application.
     */
    @PostMapping("/{id}/apply")
    public ResponseEntity<ApplicationResponse> applyToJob(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @PathVariable Long id,
            @RequestBody(required = false) ApplyJobRequest request
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

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        if (applicationRepository.existsByJobIdAndJobSeekerProfileId(job.getId(), profile.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have already applied for this job");
        }

        Application application = Application.builder()
                .job(job)
                .jobSeekerProfile(profile)
                .status(ApplicationStatus.PENDING)
                .coverLetter(request != null ? request.getCoverLetter() : null)
                .resumeUrl(request != null ? request.getResumeUrl() : profile.getResumeUrl())
                .build();

        Application saved = applicationRepository.save(application);

        // Audit status history
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(saved)
                .status(ApplicationStatus.PENDING)
                .changedBy(user.getEmail())
                .changedAt(LocalDateTime.now())
                .notes("Application submitted")
                .build();
        statusHistoryRepository.save(history);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApplicationResponse.fromEntity(saved));
    }
}
