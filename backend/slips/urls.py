from django.urls import path
from .views import SlipUploadView, SlipListView

urlpatterns = [
    path('upload/', SlipUploadView.as_view(), name='upload-paper'),
    path('slip/', SlipListView.as_view(), name='paper-list'),
]
