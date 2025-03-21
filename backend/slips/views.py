from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Slip
from .serializers import SlipSerializer
from .utils import upload_slip_to_pinata
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view

class SlipUploadView(APIView):
    permission_classes = [IsAuthenticated]  # Enforce authentication
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        user_uid = request.data.get('user_uid')  # Ensure user_uid is provided

        if not user_uid:
            return Response({"error": "user_uid is required"}, status=status.HTTP_400_BAD_REQUEST)

        if file:
            # Upload the file to IPFS
            ipfs_hash = upload_slip_to_pinata(file)

            # Store the slip info in the database
            slip = Slip.objects.create(
                ipfs_hash=ipfs_hash, 
                user_uid=user_uid
            )
            
            serializer = SlipSerializer(slip)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

class SlipListView(ListAPIView):
    """
    API endpoint to retrieve slips filtered by user_uid.
    """
    serializer_class = SlipSerializer
    permission_classes = [IsAuthenticated]  # Enforce authentication

    def get_queryset(self):
        user_uid = self.request.query_params.get('user_uid')  # Get user_uid from query params
        if user_uid:
            return Slip.objects.filter(user_uid=user_uid)  # Filter by user_uid
        return Slip.objects.all()  # Return all slips


@api_view(['POST'])
def save_wallet_address(request):
    """
    Stores the UID and Wallet Address of a user.
    Expects: { "uid": "OAUTH_USER_ID", "wallet_address": "0x..." }
    """
    serializer = UserWalletSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Wallet Address Saved!", "data": serializer.data}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)