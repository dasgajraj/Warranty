from rest_framework import serializers
from .models import Slip

class SlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slip
        fields = ['product_name', 'user-address', 'warranty_start_date', 'warranty_end_date', 'device_name']