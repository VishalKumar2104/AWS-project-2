-- V4: Add 20+ diverse, high-quality tech companies and job openings

INSERT INTO users (id, firebase_uid, email, role, is_enabled)
VALUES 
(5, 'seed_recruiter_microsoft', 'hiring@microsoft.com', 'ROLE_RECRUITER', 1),
(6, 'seed_recruiter_netflix', 'talent@netflix.com', 'ROLE_RECRUITER', 1),
(7, 'seed_recruiter_stripe', 'jobs@stripe.com', 'ROLE_RECRUITER', 1),
(8, 'seed_recruiter_amazon', 'tech-careers@amazon.com', 'ROLE_RECRUITER', 1),
(9, 'seed_recruiter_apple', 'recruiting@apple.com', 'ROLE_RECRUITER', 1),
(10, 'seed_recruiter_spotify', 'jobs@spotify.com', 'ROLE_RECRUITER', 1),
(11, 'seed_recruiter_adobe', 'talent@adobe.com', 'ROLE_RECRUITER', 1),
(12, 'seed_recruiter_postman', 'careers@postman.com', 'ROLE_RECRUITER', 1),
(13, 'seed_recruiter_uber', 'jobs@uber.com', 'ROLE_RECRUITER', 1),
(14, 'seed_recruiter_zerodha', 'talent@zerodha.com', 'ROLE_RECRUITER', 1),
(15, 'seed_recruiter_swiggy', 'careers@swiggy.in', 'ROLE_RECRUITER', 1)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO companies (id, user_id, name, description, website, logo_url, location, industry)
VALUES
(5, 5, 'Microsoft', 'Empowering every person and organization on the planet to achieve more through cloud and AI.', 'https://microsoft.com', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=128&h=128&fit=crop', 'Hyderabad, India', 'Cloud / Enterprise Software'),
(6, 6, 'Netflix', 'World-leading entertainment service providing streaming movies and television series.', 'https://netflix.com', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=128&h=128&fit=crop', 'Remote, Worldwide', 'Entertainment / Streaming'),
(7, 7, 'Stripe', 'Financial infrastructure platform building the economic engine of the internet.', 'https://stripe.com', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop', 'Remote, Global', 'FinTech / Payments'),
(8, 8, 'Amazon', 'Guided by customer obsession, passion for invention, and operational excellence.', 'https://amazon.jobs', 'https://images.unsplash.com/photo-1523474253243-383a82923595?w=128&h=128&fit=crop', 'Bangalore, India', 'E-Commerce / Cloud (AWS)'),
(9, 9, 'Apple', 'Innovating in hardware, software, services, and retail with focus on privacy and design.', 'https://apple.com/careers', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=128&h=128&fit=crop', 'Hyderabad, India', 'Consumer Electronics / Software'),
(10, 10, 'Spotify', 'Transforming music and podcast listening forever with personalized audio streaming.', 'https://spotify.com', 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=128&h=128&fit=crop', 'Remote, Europe/Asia', 'Audio Streaming / Media'),
(11, 11, 'Adobe', 'Creativity for all — enabling digital experiences, creative tools, and cloud documents.', 'https://adobe.com', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=128&h=128&fit=crop', 'Noida, India', 'Design / Creative Cloud'),
(12, 12, 'Postman', 'The leading API platform used by 30 million+ developers to build and test APIs.', 'https://postman.com', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop', 'Bangalore, India', 'Developer Tools / APIs'),
(13, 13, 'Uber', 'Moving people and things seamlessly across cities worldwide with intelligent mobility tech.', 'https://uber.com', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=128&h=128&fit=crop', 'Hyderabad, India', 'Mobility / Logistics'),
(14, 14, 'Zerodha', 'India largest stock broker platform pioneering zero-brokerage trading and tech-first investing.', 'https://zerodha.com', 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=128&h=128&fit=crop', 'Bangalore, India', 'FinTech / Trading'),
(15, 15, 'Swiggy', 'On-demand convenience platform connecting millions with food, groceries, and instant deliveries.', 'https://swiggy.com', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=128&h=128&fit=crop', 'Bangalore, India', 'FoodTech / Quick-Commerce')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO jobs (id, company_id, title, description, requirements, skills_required, location, job_type, salary_min, salary_max, status)
VALUES
(8, 5, 'Principal Cloud Architect (Azure)', 'Lead enterprise architecture transformations for Fortune 500 customers adopting Azure hybrid and multi-cloud solutions.', '8+ years designing scalable cloud-native architectures. Strong understanding of distributed microservices, Kubernetes, and security governance.', 'Azure, Kubernetes, Microservices, Terraform, Cloud Architecture, C# / .NET', 'Hyderabad, India', 'FULL_TIME', 4500000.00, 7500000.00, 'ACTIVE'),

(9, 6, 'Senior Distributed Systems Engineer', 'Build and optimize edge streaming infrastructure capable of delivering 4K HDR video to 250M+ global households with sub-second latency.', 'Deep experience in Java/C++ or Go, network protocols (HTTP/3, gRPC), CDN architectures, and high-throughput real-time telemetry.', 'Java, Go, C++, gRPC, Kafka, Distributed Systems, High Concurrency', 'Remote', 'REMOTE', 5000000.00, 9000000.00, 'ACTIVE'),

(10, 7, 'Staff Payment Security Engineer', 'Design cryptographic key management systems and secure transaction pipelines complying with PCI-DSS Level 1 standards globally.', 'Strong security background in threat modeling, public-key cryptography, OAuth2/OIDC, and building resilient security primitives.', 'Security, Cryptography, OAuth2, Python, Go, Cloud Security, Threat Modeling', 'Remote', 'REMOTE', 4200000.00, 7000000.00, 'ACTIVE'),

(11, 8, 'Senior DevOps & SRE Lead (AWS)', 'Drive operational excellence, automated incident mitigation, and multi-region chaos engineering across tier-1 AWS retail services.', '5+ years in SRE/DevOps roles. Expert knowledge of AWS CDK/CloudFormation, Docker, Prometheus, Grafana, and Linux internals.', 'AWS, Terraform, Docker, Kubernetes, Prometheus, Python, Linux', 'Bangalore, India', 'FULL_TIME', 3200000.00, 5800000.00, 'ACTIVE'),

(12, 9, 'iOS Software Engineer (Swift / SwiftUI)', 'Craft fluid, accessible, and delightful native application experiences integrated tightly with Apple silicon and hardware sensors.', '3+ years native iOS development in Swift, SwiftUI, Combine, and CoreData. Passion for high-fidelity animations and UI performance.', 'iOS, Swift, SwiftUI, Combine, Apple SDKs, Mobile Architecture', 'Hyderabad, India', 'FULL_TIME', 2800000.00, 4800000.00, 'ACTIVE'),

(13, 10, 'Machine Learning Engineer (Recommendations)', 'Train and deploy large-scale recommendation models personalizing audio content feeds and discover playlists for millions of active listeners.', 'Strong foundation in Deep Learning, PyTorch, RecSys algorithms, Vector Search, and real-time feature stores.', 'Python, PyTorch, RecSys, Spark, Vector Search, MLOps, SQL', 'Remote', 'REMOTE', 3600000.00, 6200000.00, 'ACTIVE'),

(14, 11, 'Senior Product Designer (Design Systems)', 'Lead the cross-platform design token architecture, accessibility standards, and component libraries for creative web applications.', 'Exceptional portfolio showcasing design systems, Figma master components, token pipelines, and cross-discipline collaboration.', 'Figma, Design Systems, UX Research, Interaction Design, Accessibility, Prototyping', 'Noida, India', 'FULL_TIME', 2400000.00, 4000000.00, 'ACTIVE'),

(15, 12, 'Developer Advocate / Technical Writer', 'Create world-class technical documentation, SDK tutorials, and interactive API workspaces for global software developers.', 'Experience building APIs and developer tools. Ability to explain complex technical concepts with clarity and enthusiasm.', 'API Design, Postman, JavaScript, Technical Writing, Developer Relations, REST/GraphQL', 'Bangalore, India', 'CONTRACT', 1800000.00, 3000000.00, 'ACTIVE'),

(16, 13, 'Data Platform Engineer (Real-Time Analytics)', 'Architect Apache Flink streaming pipelines and real-time marketplace pricing engines processing petabytes of sensor data.', 'Strong expertise in Apache Flink, Kafka, Presto/Trino, Apache Iceberg, and Java/Scala distributed computing.', 'Apache Flink, Kafka, Trino, Java, Scala, Data Engineering, ClickHouse', 'Hyderabad, India', 'FULL_TIME', 3000000.00, 5400000.00, 'ACTIVE'),

(17, 14, 'Full Stack Web Developer (Go / Vue.js)', 'Build low-latency trading dashboards, order execution interfaces, and high-frequency market charts with minimalist code footprint.', 'Proficient in Go, Vue.js / Vanilla JS, WebSockets, Redis, and high-performance frontend rendering.', 'Go, Vue.js, WebSockets, PostgreSQL, Redis, Performance Optimization', 'Bangalore, India', 'FULL_TIME', 2200000.00, 3800000.00, 'ACTIVE'),

(18, 15, 'QA Automation Engineer (Mobile & Backend)', 'Build automated end-to-end testing frameworks ensuring 99.99% reliability for high-traffic order fulfillment and routing engines.', '3+ years experience with Appium, Cypress/Playwright, RestAssured, JUnit, and CI/CD automated test pipelines.', 'Playwright, Appium, Java, Selenium, CI/CD, Test Automation', 'Bangalore, India', 'FULL_TIME', 1600000.00, 2600000.00, 'ACTIVE'),

(19, 5, 'AI Research Intern (GenAI / LLMs)', 'Research and experiment with frontier multi-modal LLM reasoning, fine-tuning, and prompt optimization techniques.', 'Strong academic background in Machine Learning / NLP, proficiency in Python, PyTorch/TensorFlow, and transformer architectures.', 'Python, PyTorch, NLP, Transformers, GenAI, HuggingFace', 'Bangalore, India', 'INTERNSHIP', 60000.00, 100000.00, 'ACTIVE'),

(20, 8, 'Frontend Engineer - AWS Console (React)', 'Build intuitive, modular cloud management console interfaces used by millions of enterprise cloud practitioners.', '3+ years experience with React, TypeScript, state machines, micro-frontends, and automated testing.', 'React, TypeScript, Next.js, Redux, Jest, CSS-in-JS', 'Bangalore, India', 'FULL_TIME', 2000000.00, 3600000.00, 'ACTIVE'),

(21, 6, 'Product Manager - Content Discovery', 'Lead product roadmap and A/B experimentation for personalized home feed discovery and search algorithms.', '4+ years of product management in consumer tech, video streaming, or search platforms. Strong data-driven analytical mindset.', 'Product Management, A/B Testing, User Research, SQL, Product Analytics, Agile', 'Remote', 'REMOTE', 3400000.00, 5800000.00, 'ACTIVE')
ON DUPLICATE KEY UPDATE id=id;
