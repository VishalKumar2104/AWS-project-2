package com.hirehub.service;

import com.hirehub.dto.response.JobResponse;
import com.hirehub.entity.Company;
import com.hirehub.entity.Job;
import com.hirehub.entity.User;
import com.hirehub.enums.JobStatus;
import com.hirehub.enums.Role;
import com.hirehub.repository.CompanyRepository;
import com.hirehub.repository.JobRepository;
import com.hirehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DailyJobSyncService {

    private final RapidApiJobService rapidApiJobService;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    /**
     * Runs automatically every day at midnight (00:00:00) to fetch fresh daily jobs.
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void scheduleDailyJobSync() {
        log.info("Running daily scheduled job synchronization for date: {}", LocalDate.now());
        syncDailyJobs();
    }

    /**
     * Synchronize fresh jobs from RapidAPI into the database.
     */
    public void syncDailyJobs() {
        try {
            String[] searchTerms = {"Software Engineer", "Frontend Developer", "Backend Engineer", "AI ML Engineer", "DevOps Cloud"};
            for (String term : searchTerms) {
                List<JobResponse> liveJobs = rapidApiJobService.searchLiveJobs(term, null, null, 0, 5);
                if (liveJobs != null && !liveJobs.isEmpty()) {
                    for (JobResponse j : liveJobs) {
                        saveOrUpdateExternalJob(j);
                    }
                }
            }
            log.info("Daily job synchronization completed successfully.");
        } catch (Exception e) {
            log.error("Error during daily job sync: {}", e.getMessage(), e);
        }
    }

    private void saveOrUpdateExternalJob(JobResponse res) {
        try {
            String companyName = res.getCompany() != null ? res.getCompany().getName() : "Tech Company";
            String email = "recruiter@" + companyName.toLowerCase().replaceAll("[^a-z0-9]", "") + ".com";
            
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = User.builder()
                                .email(email)
                                .firebaseUid("daily_sync_" + companyName.toLowerCase().replaceAll("[^a-z0-9]", ""))
                                .role(Role.ROLE_RECRUITER)
                                .isEnabled(true)
                                .build();
                        return userRepository.save(newUser);
                    });

            Company company = companyRepository.findByUserId(user.getId())
                    .orElseGet(() -> {
                        Company newComp = Company.builder()
                                .user(user)
                                .name(companyName)
                                .logoUrl(res.getCompany() != null ? res.getCompany().getLogoUrl() : null)
                                .location(res.getLocation())
                                .industry("Technology")
                                .build();
                        return companyRepository.save(newComp);
                    });

            // Add or refresh job with today's date
            boolean exists = jobRepository.findByCompanyIdOrderByCreatedAtDesc(company.getId()).stream()
                    .anyMatch(existing -> existing.getTitle().equalsIgnoreCase(res.getTitle()));

            if (!exists) {
                Job job = Job.builder()
                        .company(company)
                        .title(res.getTitle())
                        .description(res.getDescription())
                        .skillsRequired(res.getSkillsRequired())
                        .location(res.getLocation())
                        .jobType(res.getJobType())
                        .salaryMin(res.getSalaryMin())
                        .salaryMax(res.getSalaryMax())
                        .status(JobStatus.ACTIVE)
                        .build();
                jobRepository.save(job);
                log.info("Synced new daily job: '{}' at {}", job.getTitle(), company.getName());
            }
        } catch (Exception e) {
            log.warn("Could not save daily synced job: {}", e.getMessage());
        }
    }
}
