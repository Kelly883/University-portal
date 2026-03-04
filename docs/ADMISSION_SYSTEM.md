
# Student Admission System Documentation

## Overview
The Titan University Admission System allows prospective students to apply online, and administrators to manage applications. It includes a role-based access control (RBAC) system for Superadmins to delegate admission management to specific Admins.

## Features
1.  **Public Admission Form**: Accessible at `/admissions/apply`.
2.  **Admission Dashboard**: Accessible to authorized Admins at `/admin/admissions`.
3.  **Permission Management**: Accessible to Superadmins at `/superadmin/permissions`.
4.  **RBAC**: Fine-grained permissions for Admins.

## User Manual

### For Superadmins: Managing Permissions
1.  Log in as a Superadmin.
2.  Navigate to **Dashboard** -> **Admins** (or use the sidebar link if available).
3.  Go to the **Permissions** page (`/superadmin/permissions`).
4.  You will see a list of all Administrators.
5.  Toggle the **Manage Admissions** checkbox to grant or revoke access to the Admission Dashboard.
6.  Toggle the **View Dashboard** checkbox to grant a link to the Superadmin Dashboard (Restricted View).

### For Admins: Managing Admissions
1.  Log in as an Admin.
2.  If you have been granted the **Manage Admissions** permission, you will see an **Admissions** link in the sidebar.
3.  Click it to view the list of applications.
4.  You can see applicant details, status, and download transcripts.

### For Applicants
1.  Visit `/admissions/apply`.
2.  Fill out the form with personal and academic details.
3.  Upload your transcript (PDF/Image, max 2MB).
4.  Submit the form.
5.  Save your **Tracking ID** displayed on the success screen.

## Technical Details
*   **Database**: `Admission` table stores application data. `AdminPermission` table stores RBAC.
*   **Storage**: Transcripts are currently stored as Base64 strings (Mock Implementation). In production, configure S3/Cloudinary.
*   **Email**: Email notifications are mocked (logged to server console).
