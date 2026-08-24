package com.hirehub.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Security principal extracted from a verified Firebase ID Token.
 * Stored as the principal in UsernamePasswordAuthenticationToken.
 */
@Getter
@AllArgsConstructor
public class FirebasePrincipal {
    /** Firebase UID — stable, unique identifier for the user */
    private final String uid;
    /** User's email address from Firebase */
    private final String email;
    /** Role — either from custom claim or default ROLE_JOB_SEEKER */
    private final String role;
}
