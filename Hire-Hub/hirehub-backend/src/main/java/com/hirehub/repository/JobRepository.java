package com.hirehub.repository;

import com.hirehub.entity.Job;
import com.hirehub.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    List<Job> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
    Page<Job> findByStatus(JobStatus status, Pageable pageable);
}
