from django.shortcuts import render, redirect
from django.contrib import messages
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Event
from .serializers import EventSerializer

# @api_view()
# def event_list(request):
#     event = Event.objects.all()
#     serializer = EventSerializer(event, many=True)
#     return Response(serializer.data)

class event_list(ListCreateAPIView):
    serializer_class = EventSerializer
    
    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_serializer_context(self):
        return {'request': self.request}
         
class event_detail(RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    
    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)
    
    def delete(self, request, *args, **kwargs):
        event = self.get_object()
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)