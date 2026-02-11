from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.views.generic import CreateView
from .forms import StudentSignUpForm, FacultySignUpForm
from .models import User

@login_required
def dashboard(request):
    user = request.user
    if user.is_admin():
        return render(request, 'dashboard/admin_dashboard.html')
    elif user.is_faculty():
        return render(request, 'dashboard/faculty_dashboard.html')
    elif user.is_student():
        return render(request, 'dashboard/student_dashboard.html')
    elif user.is_parent():
        return render(request, 'dashboard/parent_dashboard.html')
    return render(request, 'dashboard/dashboard.html')

class StudentSignUpView(CreateView):
    model = User
    form_class = StudentSignUpForm
    template_name = 'registration/signup_form.html'

    def get_context_data(self, **kwargs):
        kwargs['user_type'] = 'student'
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('dashboard')

class FacultySignUpView(CreateView):
    model = User
    form_class = FacultySignUpForm
    template_name = 'registration/signup_form.html'

    def get_context_data(self, **kwargs):
        kwargs['user_type'] = 'faculty'
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('dashboard')
