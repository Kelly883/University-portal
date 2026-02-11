# University Portal System

A fully functional university portal built with Django, PostgreSQL, and Bootstrap 5.

## Features

- **Role-based Access Control**: Admin, Faculty, Student, Parent.
- **Student Module**: Enrollment, Grades, Attendance, Notifications.
- **Faculty Module**: Course Management, Attendance Marking, Grading.
- **Admin Module**: User Management, Course Management, Analytics.
- **Notifications**: System-generated alerts.
- **Responsive Design**: Mobile-friendly UI.

## Prerequisites

- Python 3.8+
- PostgreSQL
- pip

## Installation

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Database Setup**
   Ensure PostgreSQL is running. Create a database named `university_portal` (or customize via environment variables).
   
   Default credentials (can be overridden):
   - Name: `university_portal`
   - User: `postgres`
   - Password: `password`
   - Host: `localhost`
   - Port: `5432`

   To override, set environment variables:
   ```bash
   export DB_NAME='your_db_name'
   export DB_USER='your_db_user'
   export DB_PASSWORD='your_db_password'
   ```
   (On Windows PowerShell: `$env:DB_NAME='your_db_name'`)

3. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create Superuser (Admin)**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

6. **Access the Portal**
   - Open [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - Login with the superuser account to access the Admin Dashboard.
   - Use the Sign Up page to create Student/Faculty accounts.

## Project Structure

- `accounts`: User authentication and profiles.
- `academic`: Departments, Courses, Enrollments, Materials.
- `attendance`: Attendance tracking.
- `exams`: Exams and Results.
- `notifications`: System notifications.
- `templates`: HTML templates using Bootstrap 5.
