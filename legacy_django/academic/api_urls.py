from django.urls import path
from . import api_views

urlpatterns = [
    path('courses/', api_views.CourseListAPIView.as_view(), name='api_course_list'),
    path('courses/<int:pk>/', api_views.CourseDetailAPIView.as_view(), name='api_course_detail'),
    path('enroll/', api_views.EnrollmentCreateAPIView.as_view(), name='api_enroll'),
]
