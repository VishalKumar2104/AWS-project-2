// Shared TypeScript types for HireHub

export type Role = "ROLE_JOB_SEEKER" | "ROLE_RECRUITER" | "ROLE_ADMIN";
export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
export type JobStatus = "ACTIVE" | "CLOSED" | "DRAFT";
export type ApplicationStatus = "PENDING" | "SHORTLISTED" | "REJECTED" | "HIRED" | "WITHDRAWN";

export interface User {
  id: number;
  email: string;
  role: Role;
  firebaseUid?: string;
  firstName?: string;
  lastName?: string;
  companyId?: number;
  companyName?: string;
  profileId?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  skillsRequired?: string;
  location?: string;
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  company: {
    id: number;
    name: string;
    logoUrl?: string;
    location?: string;
    industry?: string;
    website?: string;
  };
}

export interface JobRequest {
  title: string;
  description: string;
  requirements?: string;
  skillsRequired?: string;
  location?: string;
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  status?: JobStatus;
}

export interface Application {
  id: number;
  job: Job;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
  jobSeekerProfile?: {
    id: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
    skills?: string;
  };
}

export interface JobSeekerProfile {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  resumeUrl?: string;
  skills?: string;
  bio?: string;
  location?: string;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  location?: string;
  industry?: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
