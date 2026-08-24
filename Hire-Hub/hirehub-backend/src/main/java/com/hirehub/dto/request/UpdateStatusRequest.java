package com.hirehub.dto.request;

import com.hirehub.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    @NotNull
    private ApplicationStatus status;
    private String notes;
}
