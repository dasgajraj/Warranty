from django.db import models

class Warranty(models.Model):
    product_name = models.CharField(max_length=255)  # Ensure this exists
    user_address = models.TextField()  # Ensure this exists
    warranty_start_date = models.DateField()  # Ensure this exists
    warranty_end_date = models.DateField()  # Ensure this exists

    def __str__(self):
        return self.product_name
