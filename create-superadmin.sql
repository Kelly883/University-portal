-- Run this SQL script directly against your Railway PostgreSQL database to create the superadmin account.
-- You can execute this via psql, DBeaver, or your preferred PostgreSQL client.

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
  '$2a$10$6Y3wK5h7YL5kL5x5kL5kLeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', -- bcrypt hash of 'password123'
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
