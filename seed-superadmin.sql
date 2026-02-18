-- PostgreSQL SQL script to create superadmin and sample users
-- Execute this script in your Railway database using psql, DBeaver, or the Railway dashboard query editor

-- Create the superadmin user
INSERT INTO "User" (
  id, 
  name, 
  email, 
  password, 
  role, 
  "emailVerified", 
  image, 
  "staffId", 
  "matricNo", 
  "createdById",
  "createdAt", 
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'Superadmin',
  'superadmin@titan.edu',
  '$2a$10$hLVs6T54jyfhLMgBpXZkxemqI9wlJ6azEVGv2HLm/pzHw3OeZIGsK',
  'SUPERADMIN',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Optional: Create sample admin, faculty, and student accounts
INSERT INTO "User" (
  id, 
  name, 
  email, 
  password, 
  role, 
  "createdAt", 
  "updatedAt"
) VALUES 
(gen_random_uuid()::text, 'Admin User', 'admin@titan.edu', '$2a$10$hLVs6T54jyfhLMgBpXZkxemqI9wlJ6azEVGv2HLm/pzHw3OeZIGsK', 'ADMIN', NOW(), NOW()),
(gen_random_uuid()::text, 'Dr. Faculty', 'faculty@titan.edu', '$2a$10$hLVs6T54jyfhLMgBpXZkxemqI9wlJ6azEVGv2HLm/pzHw3OeZIGsK', 'FACULTY', NOW(), NOW()),
(gen_random_uuid()::text, 'John Student', 'student@titan.edu', '$2a$10$hLVs6T54jyfhLMgBpXZkxemqI9wlJ6azEVGv2HLm/pzHw3OeZIGsK', 'STUDENT', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
