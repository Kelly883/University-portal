from django.db.models.signals import post_save
from django.dispatch import receiver
from exams.models import Result
from .models import Notification

@receiver(post_save, sender=Result)
def notify_result_published(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.student,
            title="New Exam Result",
            message=f"You have received a new grade for {instance.exam.course.name}: {instance.exam.title}."
        )
