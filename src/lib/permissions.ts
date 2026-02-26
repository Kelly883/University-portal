export const PERMISSIONS = [
  { id: "REGISTER_STUDENT", label: "Register Students" },
  { id: "REMOVE_STUDENT", label: "Remove Students" },
  { id: "CREATE_COURSE", label: "Create Courses" },
  { id: "EDIT_COURSE", label: "Edit Courses" },
  { id: "DELETE_COURSE", label: "Delete Courses" },
  { id: "CREATE_FEES", label: "Create Fees" },
  { id: "EDIT_FEES", label: "Edit Fees" },
  { id: "DELETE_FEES", label: "Delete Fees" },
  { id: "MANAGE_GRADES", label: "Manage Grades" },
  { id: "VIEW_REPORTS", label: "View Reports & Analytics" },
  { id: "CREATE_ADMIN", label: "Create Admin" },
  { id: "EDIT_ADMIN", label: "Edit Admin" },
  { id: "DELETE_ADMIN", label: "Delete Admin" },
];

export type Permission = typeof PERMISSIONS[number]["id"];
