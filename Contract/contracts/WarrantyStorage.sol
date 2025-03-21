// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WarrantyStorage {
    struct Warranty {
        string ipfsHash;        // Stores warranty details (IPFS)
        uint256 warrantyEndDate; // Expiry date of the warranty
        string imeiNumber;       // Device IMEI number
        address owner;           // Current warranty owner
        bool exists;             // Tracks if warranty exists
    }

    mapping(uint256 => Warranty) public warranties;
    uint256 public warrantyCounter;
    
    // Mapping to track IMEI numbers to warranty IDs
    mapping(string => uint256) private imeiToWarrantyId;

    event WarrantyIssued(uint256 indexed warrantyId, address indexed owner, string imeiNumber);
    event WarrantyTransferred(uint256 indexed warrantyId, address indexed from, address indexed to);
    event WarrantyRevoked(uint256 indexed warrantyId, address indexed admin);

    modifier onlyOwner(uint256 warrantyId) {
        require(warranties[warrantyId].exists, "Warranty does not exist");
        require(msg.sender == warranties[warrantyId].owner, "Not the warranty owner");
        _;
    }

    function issueWarranty(
        string memory _ipfsHash,
        uint256 _warrantyEndDate,
        string memory _imeiNumber
    ) external {
        // Ensure IMEI is not already registered
        require(imeiToWarrantyId[_imeiNumber] == 0, "IMEI already registered");
        
        warrantyCounter++;
        warranties[warrantyCounter] = Warranty(_ipfsHash, _warrantyEndDate, _imeiNumber, msg.sender, true);
        
        // Store the IMEI to warranty ID mapping
        imeiToWarrantyId[_imeiNumber] = warrantyCounter;

        emit WarrantyIssued(warrantyCounter, msg.sender, _imeiNumber);
    }

    function transferWarranty(uint256 warrantyId, address newOwner) external onlyOwner(warrantyId) {
        require(newOwner != address(0), "Invalid new owner address");
        warranties[warrantyId].owner = newOwner;

        emit WarrantyTransferred(warrantyId, msg.sender, newOwner);
    }

    function revokeWarranty(uint256 warrantyId) external onlyOwner(warrantyId) {
        string memory imei = warranties[warrantyId].imeiNumber;
        
        // Clean up the IMEI mapping
        delete imeiToWarrantyId[imei];
        
        // Delete the warranty
        delete warranties[warrantyId];
        
        emit WarrantyRevoked(warrantyId, msg.sender);
    }

    function getWarrantyDetails(uint256 warrantyId)
        external
        view
        returns (string memory, uint256, string memory, address)
    {
        require(warranties[warrantyId].exists, "Warranty does not exist");
        Warranty memory w = warranties[warrantyId];
        return (w.ipfsHash, w.warrantyEndDate, w.imeiNumber, w.owner);
    }
    
    // New function to search for warranty by IMEI number
    function searchWarrantyByImei(string memory _imeiNumber) 
        external 
        view 
        returns (uint256 warrantyId, string memory ipfsHash, uint256 warrantyEndDate, address owner) 
    {
        warrantyId = imeiToWarrantyId[_imeiNumber];
        require(warrantyId != 0, "No warranty found for this IMEI");
        require(warranties[warrantyId].exists, "Warranty no longer exists");
        
        Warranty memory w = warranties[warrantyId];
        return (warrantyId, w.ipfsHash, w.warrantyEndDate, w.owner);
    }
}