import bcrypt from 'bcryptjs';

async function generateSuperadmin() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const sqlScript = `-- Run this SQL script directly against your Railway PostgreSQL database to create the superadmin account.

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
  '${hashedPassword}',
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
(gen_random_uuid()::text, 'Admin User', 'admin@titan.edu', '${hashedPassword}', 'ADMIN', NOW(), NOW()),
(gen_random_uuid()::text, 'Dr. Faculty', 'faculty@titan.edu', '${hashedPassword}', 'FACULTY', NOW(), NOW()),
(gen_random_uuid()::text, 'John Student', 'student@titan.edu', '${hashedPassword}', 'STUDENT', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
`;

  console.log(sqlScript);
}

generateSuperadmin().catch(console.error);
