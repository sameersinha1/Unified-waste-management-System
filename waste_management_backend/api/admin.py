from django.contrib import admin
from .models import (
    Users,
    CitizenDetails,
    FieldStaffDetails,
    Routes,
    Tasks,
    CollectionLogs,
    PickupSchedules
)

# Register each model with the admin site
admin.site.register(Users)
admin.site.register(CitizenDetails)
admin.site.register(FieldStaffDetails)
admin.site.register(Routes)
admin.site.register(Tasks)
admin.site.register(CollectionLogs)
admin.site.register(PickupSchedules)