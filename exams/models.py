from django.db import models
from django.conf import settings
from academic.models import Course

class Exam(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='exams')
    title = models.CharField(max_length=200)
    date = models.DateTimeField()
    total_marks = models.PositiveIntegerField()
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.course.code} - {self.title}"

class Result(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'student'}, related_name='results')
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    
    @property
    def percentage(self):
        return (self.marks_obtained / self.exam.total_marks) * 100

    @property
    def grade(self):
        perc = self.percentage
        if perc >= 90: return 'A'
        elif perc >= 80: return 'B'
        elif perc >= 70: return 'C'
        elif perc >= 60: return 'D'
        else: return 'F'

    class Meta:
        unique_together = ('exam', 'student')

    def __str__(self):
        return f"{self.student.username} - {self.exam.title}"
