# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
# api/models.py
from django.db import models

class Users(models.Model):
    """Represents a user in the system, who can be a citizen or a staff member."""
    
    ROLE_CHOICES = [
        ('citizen', 'Citizen'),
        ('staff', 'Staff'),
    ]

    user_id = models.AutoField(primary_key=True)
    username = models.CharField(unique=True, max_length=50)
    password_hash = models.CharField(max_length=255) # In a real app, use Django's auth system.
    role = models.CharField(max_length=7, choices=ROLE_CHOICES)
    full_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True) # Automatically set when created.

    class Meta:
        db_table = 'users'
        verbose_name_plural = "Users"

    def __str__(self):
        return self.full_name


class CitizenDetails(models.Model):
    """Stores extra information for users with the 'citizen' role."""
    citizen = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    reward_points = models.IntegerField(default=0)
    address = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'citizen_details'
        verbose_name_plural = "CitizenDetails"

    def __str__(self):
        return f"{self.citizen.full_name}'s Details"


class FieldStaffDetails(models.Model):
    """Stores extra information for users with the 'staff' role."""
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    
    staff = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    shift_start_time = models.TimeField(blank=True, null=True)
    shift_end_time = models.TimeField(blank=True, null=True)
    current_status = models.CharField(max_length=8, choices=STATUS_CHOICES, default='Inactive')

    class Meta:
        db_table = 'field_staff_details'
        verbose_name_plural = "FieldStaffDetails"

    def __str__(self):
        return f"{self.staff.full_name}'s Staff Details"


class Routes(models.Model):
    """Defines a waste collection route that can be assigned to a staff member."""
    route_id = models.AutoField(primary_key=True)
    route_name = models.CharField(max_length=100)
    assigned_staff = models.ForeignKey(Users, on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        db_table = 'routes'
        verbose_name_plural = "Routes"

    def __str__(self):
        return self.route_name


class Tasks(models.Model):
    """Represents a single collection task (e.g., a specific bin) within a route."""
    
    PRIORITY_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    task_id = models.AutoField(primary_key=True)
    route = models.ForeignKey(Routes, on_delete=models.CASCADE)
    location_name = models.CharField(max_length=100)
    scheduled_time = models.TimeField(blank=True, null=True)
    priority = models.CharField(max_length=6, choices=PRIORITY_CHOICES, default='low')
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='pending')
    qr_code_id = models.CharField(unique=True, max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'tasks'
        ordering = ['scheduled_time'] # Useful for displaying tasks in order.
        verbose_name_plural = "Tasks"

    def __str__(self):
        return self.location_name


class CollectionLogs(models.Model):
    """A log entry created each time a task is completed."""
    log_id = models.AutoField(primary_key=True)
    task = models.ForeignKey(Tasks, on_delete=models.CASCADE)
    staff = models.ForeignKey(Users, on_delete=models.SET_NULL, blank=True, null=True)
    collection_time = models.DateTimeField(auto_now_add=True) # Automatically set when the log is created.
    photo_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'collection_logs'
        verbose_name_plural = "CollectionLogs"

    def __str__(self):
        return f"Log for {self.task.location_name} at {self.collection_time.strftime('%Y-%m-%d %H:%M')}"


class PickupSchedules(models.Model):
    """Stores the waste pickup schedule for a citizen."""
    
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
    ]
    
    schedule_id = models.AutoField(primary_key=True)
    citizen = models.ForeignKey(Users, on_delete=models.CASCADE)
    next_pickup_date = models.DateField(blank=True, null=True)
    next_pickup_time = models.TimeField(blank=True, null=True)
    waste_type = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=9, choices=STATUS_CHOICES, default='Scheduled')

    class Meta:
        db_table = 'pickup_schedules'
        verbose_name_plural = "PickupSchedules"
    
    def __str__(self):
        return f"Pickup for {self.citizen.full_name} on {self.next_pickup_date}"