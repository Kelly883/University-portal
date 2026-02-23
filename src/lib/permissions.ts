export const PERMISSIONS = [
  { id: "students:register", label: "Register Students" },
  { id: "students:manage", label: "Manage Students (Edit/Delete)" },
  { id: "courses:create", label: "Create Courses" },
  { id: "courses:manage", label: "Manage Courses (Edit/Delete)" },
  { id: "fees:manage", label: "Manage School Fees" },
  { id: "faculty:manage", label: "Manage Faculty" },
  { id: "reports:view", label: "View Reports & Analytics" },
];

export type Permission = typeof PERMISSIONS[number]["id"];
