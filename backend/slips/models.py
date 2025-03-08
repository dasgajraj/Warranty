from django.db import models

class Slip(models.Model):
    product_name = models.CharField(max_length=255)
    user_address = models.TextField()
    ipfs_hash = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    temp_file = models.FileField(upload_to='temp', null=True)
    warranty_start_date = models.DateField()
    warranty_end_date = models.DateField()
    

    def __str__(self):
        return self.product_name
