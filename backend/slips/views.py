from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import Slip
from .serializers import SlipSerializer
from .utils import upload_slip_to_pinata
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view


class SlipUploadView(APIView):
    permission_classes = [AllowAny]  # Enforce authentication
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
    permission_classes = [AllowAny]  # Enforce authentication

    def get_queryset(self):
        user_uid = self.request.query_params.get('user_uid')  # Get user_uid from query params
        if user_uid:
            return Slip.objects.filter(user_uid=user_uid)  # Filter by user_uid
        return Slip.objects.all()  # Return all slips


from web3 import Web3
from django.http import JsonResponse
import json
import os

RPC_URL = "http://127.0.0.1:8545"
PRIVATE_KEY = "0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa"  
CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
ABI = json.load(open("../../Contract/artifacts/contracts/warrantyStorage.sol/WarrantyStorage.json"))  # Load compiled ABI

web3 = Web3(Web3.HTTPProvider(RPC_URL))
contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

def transfer_ownership(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            warranty_id = int(data["warrantyId"])
            recipient_email = data["email"]

            # Check if email exists in mapping
            if recipient_email not in EMAIL_TO_WALLET:
                return JsonResponse({"error": "Email not linked to a wallet"}, status=400)

            new_owner_address = EMAIL_TO_WALLET[recipient_email]

            # Build transaction
            nonce = web3.eth.get_transaction_count(web3.eth.account.from_key(PRIVATE_KEY).address)
            tx = contract.functions.transferWarranty(warranty_id, new_owner_address).build_transaction({
                "chainId": 1337,  # Change according to network
                "gas": 500000,
                "gasPrice": web3.to_wei("10", "gwei"),
                "nonce": nonce,
            })

            # Sign transaction
            signed_tx = web3.eth.account.sign_transaction(tx, PRIVATE_KEY)

            # Send transaction
            tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)

            return JsonResponse({
                "message": "Ownership transfer successful",
                "warranty_id": warranty_id,
                "new_owner_email": recipient_email,
                "transaction_hash": tx_hash.hex()
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)