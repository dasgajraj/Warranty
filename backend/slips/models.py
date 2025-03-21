from django.db import models

class Slip(models.Model):
    product_name = models.CharField(max_length=255)
    user_uid = models.CharField(max_length=255, unique=True)
    owner_wallet = models.CharField(max_length=255, null=True, blank=True)  # Add this field # Store the current owner's wallet address
    ipfs_hash = models.CharField(max_length=100, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    temp_file = models.FileField(upload_to='temp', null=True)
    warranty_start_date = models.DateField()
    warranty_end_date = models.DateField()

    def __str__(self):
        return f"{self.product_name} - {self.owner_wallet}"
