# api/serializers.py
from rest_framework import serializers
from .models import (
    Users,
    Tasks,
    Routes,
    CitizenDetails,
    FieldStaffDetails,
    CollectionLogs,
    PickupSchedules
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_id', 'full_name', 'role']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Routes
        fields = '__all__'

class CitizenDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CitizenDetails
        fields = '__all__'

class FieldStaffDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldStaffDetails
        fields = '__all__'

class CollectionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionLogs
        fields = '__all__'

class PickupScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupSchedules
        fields = '__all__'