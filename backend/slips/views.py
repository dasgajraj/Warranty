from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Slip

from .serializers import SlipSerializer
from .utils import upload_slip_to_pinata
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView

class SlipUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')

        if file:
            # Upload the file to IPFS
            ipfs_hash = upload_slip_to_pinata(file)

            # Store the paper info in the database
            Slip = Slip.objects.create(
                ipfs_hash=ipfs_hash, 
                username=request.user.username
            )
            
            serializer = SlipSerializer(Slip)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

class SlipListView(ListAPIView):
    """
    API endpoint to retrieve papers filtered by user_uid.
    """
    serializer_class = SlipSerializer

    def get_queryset(self):
        user_uid = self.request.query_params.get('user_uid')  # Get user_uid from query params
        permission_classes = [IsAuthenticated]
        if user_uid:
            return Slip.objects.filter(user_uid=user_uid)  # Filter by user_uid
        return ("error: no user_uid was found!")  # Return all if no user_uid 
