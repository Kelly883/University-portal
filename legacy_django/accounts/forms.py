from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.db import transaction
from .models import User, Profile

class StudentSignUpForm(UserCreationForm):
    phone_number = forms.CharField(required=False)
    address = forms.CharField(widget=forms.Textarea, required=False)

    class Meta(UserCreationForm.Meta):
        model = User

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.role = 'student'
        user.save()
        Profile.objects.create(
            user=user,
            phone_number=self.cleaned_data.get('phone_number'),
            address=self.cleaned_data.get('address')
        )
        return user

class FacultySignUpForm(UserCreationForm):
    phone_number = forms.CharField(required=False)
    address = forms.CharField(widget=forms.Textarea, required=False)

    class Meta(UserCreationForm.Meta):
        model = User

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.role = 'faculty'
        user.save()
        Profile.objects.create(
            user=user,
            phone_number=self.cleaned_data.get('phone_number'),
            address=self.cleaned_data.get('address')
        )
        return user
