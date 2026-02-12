from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Course, Enrollment, CourseMaterial

class CourseListView(LoginRequiredMixin, ListView):
    model = Course
    template_name = 'academic/course_list.html'
    context_object_name = 'courses'

class CourseDetailView(LoginRequiredMixin, DetailView):
    model = Course
    template_name = 'academic/course_detail.html'

@login_required
def enroll_course(request, pk):
    course = get_object_or_404(Course, pk=pk)
    if request.user.is_student():
        Enrollment.objects.get_or_create(student=request.user, course=course)
    return redirect('course_detail', pk=pk)

class MyCoursesView(LoginRequiredMixin, ListView):
    template_name = 'academic/my_courses.html'
    context_object_name = 'courses'

    def get_queryset(self):
        user = self.request.user
        if user.is_faculty():
            return Course.objects.filter(faculty=user)
        elif user.is_student():
            return Course.objects.filter(enrollments__student=user, enrollments__status='approved')
        return Course.objects.none()
