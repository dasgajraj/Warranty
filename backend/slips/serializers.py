from rest_framework import serializers
from .models import Slip

class SlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slip
        fields = ['product_name', 'user_uid', 'ipfs_hash', 'uploaded_at', 'warranty_end_date']
