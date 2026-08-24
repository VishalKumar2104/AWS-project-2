package com.hirehub.dto.response;

import com.hirehub.entity.Application;
import com.hirehub.entity.JobSeekerProfile;
import com.hirehub.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private JobResponse job;
    private ApplicationStatus status;
    private String coverLetter;
    private String resumeUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ProfileSummary jobSeekerProfile;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileSummary {
        private Long id;
        private String firstName;
        private String lastName;
        private String phone;
        private String location;
        private String skills;
    }

    public static ApplicationResponse fromEntity(Application app) {
        JobSeekerProfile p = app.getJobSeekerProfile();
        ProfileSummary profileSummary = null;
        if (p != null) {
            profileSummary = ProfileSummary.builder()
                    .id(p.getId())
                    .firstName(p.getFirstName())
                    .lastName(p.getLastName())
                    .phone(p.getPhone())
                    .location(p.getLocation())
                    .skills(p.getSkills())
                    .build();
        }

        return ApplicationResponse.builder()
                .id(app.getId())
                .job(app.getJob() != null ? JobResponse.fromEntity(app.getJob()) : null)
                .status(app.getStatus())
                .coverLetter(app.getCoverLetter())
                .resumeUrl(app.getResumeUrl())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .jobSeekerProfile(profileSummary)
                .build();
    }
}
