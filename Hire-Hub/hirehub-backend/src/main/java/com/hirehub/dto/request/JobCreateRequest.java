package com.hirehub.dto.request;

import com.hirehub.enums.JobStatus;
import com.hirehub.enums.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class JobCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Description is required")
    private String description;
    private String requirements;
    private String skillsRequired;
    private String location;
    @NotNull(message = "Job type is required")
    private JobType jobType;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private JobStatus status;
}
