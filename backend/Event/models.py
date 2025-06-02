from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator

# Create your models here.
class Event(models.Model):
    DAILY = 'DAILY'
    WEEKLY = 'WEEKLY'
    MONTHLY = 'MONTHLY'
    YEARLY = 'YEARLY'
    
    REPEAT_CHOICES = [
        (DAILY, 'Daily'),
        (WEEKLY, 'Weekly'),
        (MONTHLY, 'Monthly'),
        (YEARLY, 'Yearly'),
    ]
    
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6
    
    WEEKDAY_CHOICES = [
        (MONDAY, 'Monday'),
        (TUESDAY, 'Tuesday'),
        (WEDNESDAY, 'Wednesday'),
        (THURSDAY, 'Thursday'),
        (FRIDAY, 'Friday'),
        (SATURDAY, 'Saturday'),
        (SUNDAY, 'Sunday'),
    ]
    
    MONTH_WEEK_CHOICES = [
        (1, 'First'),
        (2, 'Second'),
        (3, 'Third'),
        (4, 'Fourth'),
        (-1, 'Last'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_repeated = models.BooleanField(default=False)
    
    repeat = models.CharField(max_length=10, choices=REPEAT_CHOICES, blank=True, null=True)
    repeat_interval = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])    
    repeat_weekdays = models.JSONField(default=list, blank=True)
    repeat_month_week = models.IntegerField(choices=MONTH_WEEK_CHOICES, blank=True, null=True)
    repeat_month_weekday = models.IntegerField(choices=WEEKDAY_CHOICES, blank=True, null=True)
    repeat_end_date = models.DateTimeField(blank=True, null=True)
    repeat_count = models.PositiveIntegerField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.title
    
    
    def get_recurrence_description(self):
        if not self.is_repeated:
            return "It is one time event"
        desc = f"Repeats every {self.repeat_interval} {self.get_repeat_display().lower()}"
        
        if self.repeat == self.WEEKLY and self.repeat_weekdays:
            weekdays = [self.WEEKDAY_CHOICES[int(day)][1] for day in self.repeat_weekdays]
            desc += f" on {', '.join(weekdays)}"
        elif self.repeat == self.MONTHLY and self.repeat_month_week and self.repeat_month_weekday:
            desc += f", the {self.get_repeat_month_week_display()} {self.get_repeat_month_weekday_display()}"
        
        if self.repeat_end_date:
            desc += f" until {self.repeat_end_date.strftime('%Y-%m-%d')}"
        elif self.repeat_count:
            desc += f", {self.repeat_count} times"
        
        return desc



        