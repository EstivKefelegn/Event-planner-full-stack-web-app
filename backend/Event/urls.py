from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    path('list/', views.event_list.as_view()),
    path('list/<int:pk>/', views.event_detail.as_view()),
]