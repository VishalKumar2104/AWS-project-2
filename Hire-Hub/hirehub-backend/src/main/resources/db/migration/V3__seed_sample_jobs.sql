-- V3: Seed initial demo data for jobs and companies

INSERT INTO users (id, firebase_uid, email, role, is_enabled)
VALUES 
(1, 'seed_recruiter_google', 'recruiter@google.com', 'ROLE_RECRUITER', 1),
(2, 'seed_recruiter_razorpay', 'hiring@razorpay.com', 'ROLE_RECRUITER', 1),
(3, 'seed_recruiter_zomato', 'careers@zomato.com', 'ROLE_RECRUITER', 1),
(4, 'seed_recruiter_cred', 'talent@cred.club', 'ROLE_RECRUITER', 1)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO companies (id, user_id, name, description, website, logo_url, location, industry)
VALUES
(1, 1, 'Google', 'Organizing the worlds information and making it universally accessible and useful.', 'https://google.com', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&h=128&fit=crop&crop=faces', 'Bangalore, India', 'Technology'),
(2, 2, 'Razorpay', 'Leading payment gateway and full-stack financial services platform in India.', 'https://razorpay.com', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop&crop=faces', 'Bangalore, India', 'FinTech'),
(3, 3, 'Zomato', 'Connecting people with food across 1000+ cities in India.', 'https://zomato.com', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=128&h=128&fit=crop&crop=faces', 'Gurugram, India', 'E-Commerce / FoodTech'),
(4, 4, 'CRED', 'Members-only club that rewards individuals for timely credit card bill payments.', 'https://cred.club', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&crop=faces', 'Bangalore, India', 'FinTech')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO jobs (id, company_id, title, description, requirements, skills_required, location, job_type, salary_min, salary_max, status)
VALUES
(1, 1, 'Senior Full Stack Engineer', 'We are looking for a Senior Full Stack Engineer to lead the development of next-generation cloud productivity tools.', '5+ years experience with React, TypeScript, Node.js, or Java/Spring Boot. Strong grasp of distributed systems.', 'React, TypeScript, Java, Spring Boot, Microservices, Cloud', 'Bangalore, India', 'FULL_TIME', 2500000.00, 4500000.00, 'ACTIVE'),
(2, 1, 'Cloud Solutions Architect', 'Design high-availability cloud infrastructure solutions for enterprise customers on Google Cloud Platform.', 'Extensive knowledge of GCP/AWS, Kubernetes, Terraform, CI/CD pipelines and security best practices.', 'GCP, Kubernetes, Docker, Terraform, Python, Go', 'Remote', 'REMOTE', 3000000.00, 5500000.00, 'ACTIVE'),
(3, 2, 'Backend Platform Engineer (FinTech)', 'Build mission-critical payment processing and ledger systems handling billions of transactions securely.', '3+ years experience building scalable backend microservices in Java or Go. Experience with relational databases and message queues.', 'Java, Spring Boot, MySQL, Kafka, Redis, Distributed Systems', 'Bangalore, India', 'FULL_TIME', 1800000.00, 3200000.00, 'ACTIVE'),
(4, 2, 'Frontend Engineer - React / Next.js', 'Craft fluid, accessible, and high-performance checkout and merchant dashboard experiences.', 'Strong expertise in React, Next.js, modern CSS, state management and web performance optimization.', 'React, Next.js, TypeScript, Tailwind CSS, Redux', 'Bangalore, India', 'FULL_TIME', 1500000.00, 2600000.00, 'ACTIVE'),
(5, 3, 'Mobile App Developer (React Native)', 'Shape the customer-facing ordering and live tracking experience used by millions daily.', 'Proficiency with React Native, TypeScript, native bridging, and iOS/Android deployment.', 'React Native, TypeScript, iOS, Android, Redux', 'Gurugram, India', 'FULL_TIME', 1400000.00, 2400000.00, 'ACTIVE'),
(6, 4, 'UI/UX Product Designer', 'Create iconic, minimalist, and engaging visual experiences and design systems for high-trust financial products.', 'Portfolio demonstrating exceptional interaction design, micro-interactions, Figma design systems.', 'Figma, UI Design, UX Research, Prototyping, Design Systems', 'Bangalore, India', 'CONTRACT', 1200000.00, 2000000.00, 'ACTIVE'),
(7, 3, 'Software Development Intern (Summer 2026)', 'Fast-paced internship working alongside senior engineers on real customer-facing features.', 'Enrolled in Computer Science or related degree. Proficient in at least one modern programming language.', 'Java, Python, JavaScript, Data Structures, Algorithms', 'Remote', 'INTERNSHIP', 40000.00, 80000.00, 'ACTIVE')
ON DUPLICATE KEY UPDATE id=id;
