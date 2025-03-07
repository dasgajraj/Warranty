from django.db import models

class Slip(models.Model):
    product_name = models.CharField(max_length=255)
    user_address = models.TextField()
    warranty_start_date = models.DateField()
    warranty_end_date = models.DateField()
    device_name = models.CharField(max_length=255)

    def __str__(self):
        return self.product_name
