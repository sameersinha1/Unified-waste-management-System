# api/views.py
from rest_framework import viewsets
from .models import (
    Users,
    Tasks,
    Routes,
    CitizenDetails,
    FieldStaffDetails,
    CollectionLogs,
    PickupSchedules
)
from .serializers import (
    UserSerializer,
    TaskSerializer,
    RouteSerializer,
    CitizenDetailsSerializer,
    FieldStaffDetailsSerializer,
    CollectionLogSerializer,
    PickupScheduleSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Tasks.objects.all()
    serializer_class = TaskSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Routes.objects.all()
    serializer_class = RouteSerializer

class CitizenDetailsViewSet(viewsets.ModelViewSet):
    queryset = CitizenDetails.objects.all()
    serializer_class = CitizenDetailsSerializer

class FieldStaffDetailsViewSet(viewsets.ModelViewSet):
    queryset = FieldStaffDetails.objects.all()
    serializer_class = FieldStaffDetailsSerializer

class CollectionLogViewSet(viewsets.ModelViewSet):
    queryset = CollectionLogs.objects.all()
    serializer_class = CollectionLogSerializer

class PickupScheduleViewSet(viewsets.ModelViewSet):
    queryset = PickupSchedules.objects.all()
    serializer_class = PickupScheduleSerializer