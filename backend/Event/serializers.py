from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    recurrence_description = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__' 

    def get_recurrence_description(self, obj):
        return obj.get_recurrence_description()

    def validate(self, data):
        if data["start_time"] > data["end_time"]:
            raise serializers.ValidationError("End time can't be greater than start time")
        return data

    def create(self, validated_data):
        event = Event(**validated_data)

        if event.is_repeated:  
            event.repeat = validated_data.get("repeat")
            event.repeat_interval = validated_data.get("repeat_interval")

            if event.repeat == Event.WEEKLY:
                event.repeat_weekdays = validated_data.get("repeat_weekdays")

            elif event.repeat == Event.MONTHLY:
                event.repeat_month_week = validated_data.get("repeat_month_week")
                event.repeat_month_weekday = validated_data.get("repeat_month_weekday")

            event.repeat_end_date = validated_data.get("repeat_end_date")
            event.repeat_count = validated_data.get("repeat_count")

        event.save()
        return event
