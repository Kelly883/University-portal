from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('signup/student/', views.StudentSignUpView.as_view(), name='student_signup'),
    path('signup/faculty/', views.FacultySignUpView.as_view(), name='faculty_signup'),
]
