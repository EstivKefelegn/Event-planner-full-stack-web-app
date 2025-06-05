from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    path('', views.event_list.as_view()),
    path('events/<int:pk>/', views.event_detail.as_view()),
]