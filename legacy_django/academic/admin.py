from django.contrib import admin
from .models import Department, Course, Enrollment, CourseMaterial

class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'department', 'faculty')
    list_filter = ('department', 'faculty')
    search_fields = ('code', 'name')

class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'status', 'enrolled_at')
    list_filter = ('status', 'course')

admin.site.register(Department)
admin.site.register(Course, CourseAdmin)
admin.site.register(Enrollment, EnrollmentAdmin)
admin.site.register(CourseMaterial)
