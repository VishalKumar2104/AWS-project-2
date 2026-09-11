import api from "./api";
import type { Job, JobRequest, Application, PageResponse } from "@/types";

export interface JobFilters {
  keyword?: string;
  location?: string;
  jobType?: string;
  page?: number;
  size?: number;
}

export const jobsApi = {
  // Public
  getAll: (filters: JobFilters = {}) =>
    api.get<PageResponse<Job>>("/v1/jobs", { params: filters }).then((r) => r.data),

  getExternal: (filters: JobFilters = {}) =>
    api.get<Job[]>("/v1/jobs/external", { params: filters }).then((r) => r.data),

  getById: (id: number) => api.get<Job>(`/v1/jobs/${id}`).then((r) => r.data),

  // Recruiter
  create: (data: JobRequest) => api.post<Job>("/v1/jobs", data).then((r) => r.data),

  update: (id: number, data: Partial<JobRequest>) =>
    api.put<Job>(`/v1/jobs/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/v1/jobs/${id}`),

  getMyJobs: () => api.get<Job[]>("/v1/recruiter/jobs").then((r) => r.data),

  getJobApplicants: (jobId: number) =>
    api.get<Application[]>(`/v1/recruiter/jobs/${jobId}/applications`).then((r) => r.data),

  updateApplicationStatus: (applicationId: number, status: string, notes?: string) =>
    api.patch(`/v1/recruiter/applications/${applicationId}/status`, { status, notes }).then((r) => r.data),

  // Job Seeker
  apply: (jobId: number, data: { coverLetter?: string; resumeUrl?: string }) =>
    api.post<Application>(`/v1/jobs/${jobId}/apply`, data).then((r) => r.data),

  getMyApplications: () =>
    api.get<Application[]>("/v1/applications/me").then((r) => r.data),

  withdrawApplication: (applicationId: number) =>
    api.patch(`/v1/applications/${applicationId}/withdraw`),

  getSavedJobs: () => api.get<Job[]>("/v1/saved-jobs").then((r) => r.data),

  saveJob: (jobId: number) => api.post(`/v1/saved-jobs/${jobId}`),

  unsaveJob: (jobId: number) => api.delete(`/v1/saved-jobs/${jobId}`),

  // Profile
  updateProfile: (data: object) =>
    api.put("/v1/profile", data).then((r) => r.data),

  getProfile: () => api.get("/v1/profile").then((r) => r.data),
};
