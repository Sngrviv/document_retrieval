from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('upload-and-query/', views.upload_and_query, name='upload-and-query'),
]