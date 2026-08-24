package com.hirehub.entity;

import com.hirehub.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

    /** Firebase UID — stable, unique identifier from Firebase Auth */
    @Column(name = "firebase_uid", nullable = false, unique = true, length = 128)
    private String firebaseUid;

    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Password hash is no longer used — Firebase manages authentication.
     * Kept nullable for schema backward compatibility.
     */
    @Column(nullable = true)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    private Boolean isEnabled = true;
}
