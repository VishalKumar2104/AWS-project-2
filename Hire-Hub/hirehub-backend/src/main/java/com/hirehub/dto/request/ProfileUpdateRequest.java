package com.hirehub.dto.request;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String resumeUrl;
    private String skills;
    private String bio;
    private String location;
    // For recruiter
    private String name;
    private String description;
    private String website;
    private String logoUrl;
    private String industry;
}
