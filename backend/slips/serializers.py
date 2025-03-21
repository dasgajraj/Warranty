from rest_framework import serializers
from .models import Slip

class SlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slip
        fields = ['product_name', 'user_uid', 'ipfs_hash', 'uploaded_at', 'warranty_start_date', 'warranty_end_date']
        read_only_fields = ['ipfs_hash', 'uploaded_at']  # Prevents modification of these fields


