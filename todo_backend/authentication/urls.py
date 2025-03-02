from django.urls import path

from rest_framework.authtoken import views

from .views import RegisterUser

urlpatterns = [
    path('register-user/', RegisterUser.as_view()),
    path('get-token/', views.obtain_auth_token),
]