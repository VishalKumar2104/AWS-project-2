package com.hirehub.repository;

import com.hirehub.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByJobSeekerProfileIdOrderByCreatedAtDesc(Long profileId);
    Optional<SavedJob> findByJobIdAndJobSeekerProfileId(Long jobId, Long profileId);
    void deleteByJobIdAndJobSeekerProfileId(Long jobId, Long profileId);
    boolean existsByJobIdAndJobSeekerProfileId(Long jobId, Long profileId);
}
