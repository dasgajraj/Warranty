import time
from datetime import datetime
from web3 import Web3
import json

# Connect to Hardhat local network
RPC_URL = "http://127.0.0.1:8545"  # Hardhat default RPC
web3 = Web3(Web3.HTTPProvider(RPC_URL))

# Ensure connection is successful
assert web3.is_connected(), "Failed to connect to Hardhat node"

# Load contract details
CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"  # The deployed contract address - so to query the contract

# Updated ABI to match the actual contract functions
CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "_ipfsHash", "type": "string"},
            {"internalType": "uint256", "name": "_warrantyEndDate", "type": "uint256"},
            {"internalType": "string", "name": "_imei", "type": "string"}
        ],
        "name": "storeWarranty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_imei", "type": "string"},
            {"internalType": "string", "name": "_newIPFSHash", "type": "string"}
        ],
        "name": "updateWarrantyDocument",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_imei", "type": "string"},
            {"internalType": "uint256", "name": "_newWarrantyEndDate", "type": "uint256"}
        ],
        "name": "extendWarranty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_imei", "type": "string"}
        ],
        "name": "getWarrantyByIMEI",
        "outputs": [
            {
                "components": [
                    {"internalType": "string", "name": "ipfsHash", "type": "string"},
                    {"internalType": "uint256", "name": "warrantyEndDate", "type": "uint256"},
                    {"internalType": "string", "name": "imeiNumber", "type": "string"},
                    {"internalType": "address", "name": "issuer", "type": "address"},
                    {"internalType": "uint256", "name": "issueDate", "type": "uint256"}
                ],
                "internalType": "struct WarrantyStorage.Warranty",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_imei", "type": "string"}
        ],
        "name": "isWarrantyValid",
        "outputs": [
            {"internalType": "bool", "name": "isValid", "type": "bool"},
            {"internalType": "uint256", "name": "endDate", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getIssuerWarranties",
        "outputs": [
            {"internalType": "string[]", "name": "", "type": "string[]"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalWarrantyCount",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

# Get contract instance
contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

# Select first account from Hardhat node
account = web3.eth.accounts[0]

def store_warranty(ipfs_hash, end_date_str, imei):
    """
    Stores a warranty on the blockchain
    
    Parameters:
    - ipfs_hash: IPFS hash of the warranty document
    - end_date_str: Warranty end date in 'YYYY-MM-DD' format
    - imei: Device IMEI number
    """
    # Convert date string to Unix timestamp (seconds since epoch)
    warranty_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    warranty_timestamp = int(time.mktime(warranty_date.timetuple()))
    
    tx = contract.functions.storeWarranty(
        ipfs_hash,             # IPFS hash
        warranty_timestamp,    # Unix timestamp for warranty end date
        imei                   # IMEI
    ).build_transaction({
        "from": account,
        "gas": 2000000,
        "gasPrice": web3.to_wei("10", "gwei"),
        "nonce": web3.eth.get_transaction_count(account),
    })

    # Sign & send transaction
    tx_hash = web3.eth.send_transaction(tx)
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Warranty stored for IMEI {imei}, Transaction Hash: {receipt.transactionHash.hex()}")
    return receipt

def update_warranty_document(imei, new_ipfs_hash):
    """
    Updates the IPFS hash for an existing warranty
    
    Parameters:
    - imei: Device IMEI number
    - new_ipfs_hash: New IPFS hash for the warranty document
    """
    tx = contract.functions.updateWarrantyDocument(
        imei,           # IMEI
        new_ipfs_hash   # New IPFS hash
    ).build_transaction({
        "from": account,
        "gas": 2000000,
        "gasPrice": web3.to_wei("10", "gwei"),
        "nonce": web3.eth.get_transaction_count(account),
    })

    # Sign & send transaction
    tx_hash = web3.eth.send_transaction(tx)
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Warranty document updated for IMEI {imei}, Transaction Hash: {receipt.transactionHash.hex()}")
    return receipt

def extend_warranty(imei, new_end_date_str):
    """
    Extends the warranty period for an existing warranty
    
    Parameters:
    - imei: Device IMEI number
    - new_end_date_str: New warranty end date in 'YYYY-MM-DD' format
    """
    # Convert date string to Unix timestamp
    new_end_date = datetime.strptime(new_end_date_str, "%Y-%m-%d")
    new_end_timestamp = int(time.mktime(new_end_date.timetuple()))
    
    tx = contract.functions.extendWarranty(
        imei,              # IMEI
        new_end_timestamp  # New warranty end date timestamp
    ).build_transaction({
        "from": account,
        "gas": 2000000,
        "gasPrice": web3.to_wei("10", "gwei"),
        "nonce": web3.eth.get_transaction_count(account),
    })

    # Sign & send transaction
    tx_hash = web3.eth.send_transaction(tx)
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Warranty extended for IMEI {imei} until {new_end_date_str}, Transaction Hash: {receipt.transactionHash.hex()}")
    return receipt

def get_warranty_by_imei(imei):
    """
    Retrieves warranty details for a specific IMEI
    
    Parameters:
    - imei: Device IMEI number
    
    Returns:
    - Warranty details
    """
    try:
        warranty = contract.functions.getWarrantyByIMEI(imei).call({"from": account})
        
        # Convert timestamps to human-readable dates
        end_date = datetime.fromtimestamp(warranty[1]).strftime('%Y-%m-%d')
        issue_date = datetime.fromtimestamp(warranty[4]).strftime('%Y-%m-%d %H:%M:%S')
        
        print(f"\nWarranty Details for IMEI {imei}:")
        print(f"  IPFS Hash: {warranty[0]}")
        print(f"  Warranty End Date: {end_date}")
        print(f"  IMEI: {warranty[2]}")
        print(f"  Issuer: {warranty[3]}")
        print(f"  Issue Date: {issue_date}")
        
        return warranty
    except Exception as e:
        print(f"Error retrieving warranty for IMEI {imei}: {str(e)}")
        return None

def check_warranty_validity(imei):
    """
    Checks if a warranty is valid (exists and not expired)
    
    Parameters:
    - imei: Device IMEI number
    
    Returns:
    - Tuple of (is_valid, end_date)
    """
    try:
        result = contract.functions.isWarrantyValid(imei).call({"from": account})
        is_valid, end_timestamp = result
        
        # Convert timestamp to human-readable date if valid
        end_date = datetime.fromtimestamp(end_timestamp).strftime('%Y-%m-%d') if end_timestamp > 0 else "N/A"
        
        print(f"\nWarranty Validity for IMEI {imei}:")
        print(f"  Is Valid: {is_valid}")
        print(f"  End Date: {end_date}")
        
        return result
    except Exception as e:
        print(f"Error checking warranty validity for IMEI {imei}: {str(e)}")
        return (False, 0)

def get_issuer_warranties():
    """
    Retrieves all warranties issued by the current account
    
    Returns:
    - List of IMEI numbers
    """
    try:
        imei_list = contract.functions.getIssuerWarranties().call({"from": account})
        
        print(f"\nWarranties Issued by {account}:")
        for idx, imei in enumerate(imei_list):
            print(f"  {idx + 1}. IMEI: {imei}")
        
        return imei_list
    except Exception as e:
        print(f"Error retrieving issuer warranties: {str(e)}")
        return []

def get_total_warranty_count():
    """
    Gets the total number of warranties stored in the contract
    
    Returns:
    - Total warranty count
    """
    try:
        count = contract.functions.getTotalWarrantyCount().call({"from": account})
        print(f"\nTotal Warranty Count: {count}")
        return count
    except Exception as e:
        print(f"Error retrieving total warranty count: {str(e)}")
        return 0

# Example usage
if __name__ == "__main__":
    # Store a sample warranty
    store_warranty(
        "QmTestIPFSHash12356465452162146efafvv51561",  # IPFS hash
        "2026-03-10",                                  # Warranty end date
        "123456789012345"                              # IMEI
    )
    
    # Store another warranty to demonstrate multiple records
    store_warranty(
        "QmAnotherIPFSHash987654321987654321",         # IPFS hash
        "2025-06-15",                                  # Warranty end date
        "987654321098765"                              # IMEI
    )
    
    # Get warranties issued by current account
    get_issuer_warranties()
    
    # Get warranty details by IMEI
    get_warranty_by_imei("123456789012345")
    
    # Check warranty validity
    check_warranty_validity("123456789012345")
    
    # Update warranty document for first IMEI
    update_warranty_document(
        "123456789012345",                             # IMEI
        "QmUpdatedIPFSHash456789123456789123"          # New IPFS hash
    )
    
    # Extend warranty for second IMEI
    extend_warranty(
        "987654321098765",                             # IMEI
        "2026-12-31"                                   # New end date
    )
    
    # Get total warranty count
    get_total_warranty_count()