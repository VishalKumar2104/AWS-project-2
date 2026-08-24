package com.hirehub.controller;

import com.hirehub.dto.request.ProfileUpdateRequest;
import com.hirehub.entity.Company;
import com.hirehub.entity.JobSeekerProfile;
import com.hirehub.entity.User;
import com.hirehub.enums.Role;
import com.hirehub.repository.CompanyRepository;
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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final CompanyRepository companyRepository;

    /**
     * GET /api/v1/profile
     * Get profile details of current user.
     */
    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal FirebasePrincipal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        User user = userRepository.findByFirebaseUid(principal.getUid())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("email", user.getEmail());
        result.put("role", user.getRole());

        if (user.getRole() == Role.ROLE_JOB_SEEKER) {
            jobSeekerProfileRepository.findByUserId(user.getId())
                    .ifPresent(p -> {
                        result.put("firstName", p.getFirstName());
                        result.put("lastName", p.getLastName());
                        result.put("phone", p.getPhone());
                        result.put("resumeUrl", p.getResumeUrl());
                        result.put("skills", p.getSkills());
                        result.put("bio", p.getBio());
                        result.put("location", p.getLocation());
                    });
        } else if (user.getRole() == Role.ROLE_RECRUITER) {
            companyRepository.findByUserId(user.getId())
                    .ifPresent(c -> {
                        result.put("name", c.getName());
                        result.put("description", c.getDescription());
                        result.put("website", c.getWebsite());
                        result.put("logoUrl", c.getLogoUrl());
                        result.put("location", c.getLocation());
                        result.put("industry", c.getIndustry());
                    });
        }

        return ResponseEntity.ok(result);
    }

    /**
     * PUT /api/v1/profile
     * Update current user profile.
     */
    @PutMapping
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @RequestBody ProfileUpdateRequest request
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        User user = userRepository.findByFirebaseUid(principal.getUid())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (user.getRole() == Role.ROLE_JOB_SEEKER) {
            JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(user.getId())
                    .orElseGet(() -> JobSeekerProfile.builder().user(user).build());

            if (request.getFirstName() != null) profile.setFirstName(request.getFirstName());
            if (request.getLastName() != null) profile.setLastName(request.getLastName());
            if (request.getPhone() != null) profile.setPhone(request.getPhone());
            if (request.getResumeUrl() != null) profile.setResumeUrl(request.getResumeUrl());
            if (request.getSkills() != null) profile.setSkills(request.getSkills());
            if (request.getBio() != null) profile.setBio(request.getBio());
            if (request.getLocation() != null) profile.setLocation(request.getLocation());

            jobSeekerProfileRepository.save(profile);
        } else if (user.getRole() == Role.ROLE_RECRUITER) {
            Company company = companyRepository.findByUserId(user.getId())
                    .orElseGet(() -> Company.builder().user(user).name("Company").build());

            if (request.getName() != null) company.setName(request.getName());
            if (request.getDescription() != null) company.setDescription(request.getDescription());
            if (request.getWebsite() != null) company.setWebsite(request.getWebsite());
            if (request.getLogoUrl() != null) company.setLogoUrl(request.getLogoUrl());
            if (request.getLocation() != null) company.setLocation(request.getLocation());
            if (request.getIndustry() != null) company.setIndustry(request.getIndustry());

            companyRepository.save(company);
        }

        return getProfile(principal);
    }
}
