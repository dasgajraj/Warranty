from django.contrib import admin
from .models import Slip

@admin.register(Slip)
class WarrantyAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'user_address', 'warranty_start_date', 'warranty_end_date')  # Ensure start date is included


