# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    TaskViewSet,
    RouteViewSet,
    CitizenDetailsViewSet,
    FieldStaffDetailsViewSet,
    CollectionLogViewSet,
    PickupScheduleViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'citizen-details', CitizenDetailsViewSet)
router.register(r'staff-details', FieldStaffDetailsViewSet)
router.register(r'collection-logs', CollectionLogViewSet)
router.register(r'pickup-schedules', PickupScheduleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

