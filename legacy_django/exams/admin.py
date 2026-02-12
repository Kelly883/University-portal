from django.contrib import admin
from .models import Exam, Result

class ExamAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'date', 'total_marks')
    list_filter = ('course',)

class ResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'marks_obtained', 'grade')
    list_filter = ('exam__course', 'exam')

admin.site.register(Exam, ExamAdmin)
admin.site.register(Result, ResultAdmin)
