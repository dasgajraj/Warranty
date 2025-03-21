import os
import requests
import tempfile
import time
from datetime import datetime
from web3 import Web3
from django.conf import settings

# Pinata API endpoint for file upload
PINATA_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

# Web3 connection setup
RPC_URL = "http://127.0.0.1:8545"  # Hardhat RPC
web3 = Web3(Web3.HTTPProvider(RPC_URL))
assert web3.is_connected(), "Failed to connect to Hardhat node"

# Smart contract details
CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_warrantyEndDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_imeiNumber",
        "type": "string"
      }
    ],
    "name": "issueWarranty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "warrantyId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferWarranty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "warrantyId",
        "type": "uint256"
      }
    ],
    "name": "revokeWarranty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "warrantyId",
        "type": "uint256"
      }
    ],
    "name": "getWarrantyDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "warranties",
    "outputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "warrantyEndDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "imeiNumber",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "warrantyCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": True,
        "internalType": "uint256",
        "name": "warrantyId",
        "type": "uint256"
      },
      {
        "indexed": True,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "string",
        "name": "imeiNumber",
        "type": "string"
      }
    ],
    "name": "WarrantyIssued",
    "type": "event"
  },
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": True,
        "internalType": "uint256",
        "name": "warrantyId",
        "type": "uint256"
      },
      {
        "indexed": True,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": True,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "WarrantyTransferred",
    "type": "event"
  },
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": True,
        "internalType": "uint256",
        "name": "warrantyId",
        "type": "uint256"
      },
      {
        "indexed": True,
        "internalType": "address",
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "WarrantyRevoked",
    "type": "event"
  }
]


# Get contract instance
contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
account = web3.eth.accounts[0]  # Use first Hardhat account

def upload_slip_to_pinata(file_content, end_date_str, imei):
    """Uploads a file to Pinata, gets the IPFS hash, and stores it on the blockchain."""
    headers = {
        'pinata_api_key': settings.PINATA_API_KEY,
        'pinata_secret_api_key': settings.PINATA_API_SECRET
    }

    try:
        # Create a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        temp_file.write(file_content)
        temp_file.close()

        # Upload to Pinata
        with open(temp_file.name, 'rb') as file_data:
            response = requests.post(PINATA_URL, files={'file': ('warranty.pdf', file_data)}, headers=headers)

        os.unlink(temp_file.name)  # Cleanup temp file

        if response.status_code != 200:
            raise Exception(f"Pinata API error: {response.text}")

        ipfs_hash = response.json()['IpfsHash']
        print(f"Uploaded to IPFS: {ipfs_hash}")

        # Store on blockchain
        store_warranty(ipfs_hash, end_date_str, imei)
        return ipfs_hash

    except Exception as e:
        if 'temp_file' in locals():
            try:
                os.unlink(temp_file.name)
            except:
                pass
        raise e

def store_warranty(ipfs_hash, end_date_str, imei):
    """Stores warranty details on the blockchain."""
    warranty_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    warranty_timestamp = int(time.mktime(warranty_date.timetuple()))

    tx = contract.functions.issueWarranty(ipfs_hash, warranty_timestamp, imei).build_transaction({
        "from": account,
        "gas": 2000000,
        "gasPrice": web3.to_wei("10", "gwei"),
        "nonce": web3.eth.get_transaction_count(account),
    })

    tx_hash = web3.eth.send_transaction(tx)
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Stored on blockchain: {receipt.transactionHash.hex()}")
    return receipt
