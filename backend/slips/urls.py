from django.urls import path
from .views import SlipUploadView, SlipListView, WarrantyRegistrationView

urlpatterns = [
    path('upload/', SlipUploadView.as_view(), name='upload-paper'),
    path('slip/', SlipListView.as_view(), name='paper-list'),
    # path('transfer', transfer_ownership, name="transfer_ownership"),
    path('register-warranty/', WarrantyRegistrationView.as_view(), name='register-warranty'),
]
