package com.hirehub.dto.response;

import com.hirehub.entity.Company;
import com.hirehub.entity.Job;
import com.hirehub.enums.JobStatus;
import com.hirehub.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String skillsRequired;
    private String location;
    private JobType jobType;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CompanySummary company;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanySummary {
        private Long id;
        private String name;
        private String logoUrl;
        private String location;
        private String industry;
        private String website;
    }

    public static JobResponse fromEntity(Job job) {
        Company c = job.getCompany();
        CompanySummary companySummary = null;
        if (c != null) {
            companySummary = CompanySummary.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .logoUrl(c.getLogoUrl())
                    .location(c.getLocation())
                    .industry(c.getIndustry())
                    .website(c.getWebsite())
                    .build();
        }

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .skillsRequired(job.getSkillsRequired())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .company(companySummary)
                .build();
    }
}
