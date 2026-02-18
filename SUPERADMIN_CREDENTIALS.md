# Superadmin Login Credentials

## Account Details

**Email:** `superadmin@titan.edu`  
**Password:** `password123`  
**Role:** SUPERADMIN

---

## How to Create This Account

The superadmin account has been added to the database seed script (`prisma/seed.ts`). To create this account in your database:

### Prerequisites
1. Ensure you have a PostgreSQL database set up and connected
2. Set the `DATABASE_URL` environment variable in your `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/university_portal"
```

### Steps to Create the Account

1. **Apply database migrations** (if not already done):
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Run the seed script**:
   ```bash
   npx prisma db seed
   ```

3. **Verify the account was created**:
   - Open the app and navigate to `/login`
   - Enter Email: `superadmin@titan.edu`
   - Enter Password: `password123`
   - Click "Login with Email"

---

## What This Superadmin Can Do

- Create and manage admin accounts
- Grant/revoke permissions to admins (10 granular permissions)
- Approve or reject admin actions in the approval workflow
- View system-wide statistics and reports
- Manage faculty and departments for staff registration

---

## Permissions Available for Admin Accounts

The superadmin can assign the following permissions to admin accounts:

1. `CREATE_COURSE` - Create new courses
2. `EDIT_COURSE` - Modify existing courses
3. `DELETE_COURSE` - Remove courses
4. `REGISTER_STUDENT` - Enroll students in courses
5. `REMOVE_STUDENT` - Unenroll students
6. `CREATE_FEES` - Create fee structures
7. `EDIT_FEES` - Modify fee information
8. `DELETE_FEES` - Remove fees
9. `MANAGE_GRADES` - Update student grades
10. `VIEW_REPORTS` - Access reports and analytics

---

## Changing the Default Password

It's recommended to change the default password after first login. You can do this in your user profile settings.
