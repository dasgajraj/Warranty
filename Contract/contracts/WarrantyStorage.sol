// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract WarrantyStorage {
    // Custom errors for better gas efficiency
    error NoWarrantyFound();
    error UnauthorizedAccess();
    error InvalidIMEI();
    error InvalidWarrantyPeriod();
    error InvalidIPFSHash();

    struct Warranty {
        string ipfsHash;          // IPFS hash of warranty document
        uint256 warrantyEndDate;  // Timestamp when warranty expires
        string imeiNumber;        // Device IMEI number
        address issuer;           // Retailer/company who issued the warranty
        uint256 issueDate;        // When the warranty was issued
    }

    // Main warranty storage - maps IMEI to warranty details
    mapping(string => Warranty) private warranties;
    
    // Track all IMEIs for warranty lookup
    string[] private allIMEIs;
    
    // Track which IMEIs were registered by which issuer
    mapping(address => string[]) private issuerToIMEIs;

    // Events for better tracking and indexing
    event WarrantyStored(
        address indexed issuer,
        string ipfsHash,
        uint256 warrantyEndDate,
        string imeiNumber,
        uint256 issueDate
    );

    event WarrantyUpdated(
        address indexed issuer,
        string imeiNumber,
        string newIpfsHash
    );

    /**
     * @dev Stores a new warranty record
     * @param _ipfsHash IPFS hash of the warranty document
     * @param _warrantyEndDate Unix timestamp when warranty expires
     * @param _imei Device IMEI number
     */
    function storeWarranty(
        string memory _ipfsHash,
        uint256 _warrantyEndDate,
        string memory _imei
    ) public {
        // Validate inputs
        if (bytes(_ipfsHash).length == 0) revert InvalidIPFSHash();
        if (_warrantyEndDate <= block.timestamp) revert InvalidWarrantyPeriod();
        if (bytes(_imei).length == 0) revert InvalidIMEI();

        // Ensure this IMEI hasn't been registered before
        if (bytes(warranties[_imei].imeiNumber).length > 0) {
            // IMEI already exists, only original issuer can update
            if (warranties[_imei].issuer != msg.sender) revert UnauthorizedAccess();
        } else {
            // New IMEI, add to tracking arrays
            allIMEIs.push(_imei);
            issuerToIMEIs[msg.sender].push(_imei);
        }

        // Store warranty details
        warranties[_imei] = Warranty({
            ipfsHash: _ipfsHash,
            warrantyEndDate: _warrantyEndDate,
            imeiNumber: _imei,
            issuer: msg.sender,
            issueDate: block.timestamp
        });

        emit WarrantyStored(msg.sender, _ipfsHash, _warrantyEndDate, _imei, block.timestamp);
    }

    /**
     * @dev Update an existing warranty's IPFS hash
     * @param _imei Device IMEI number
     * @param _newIPFSHash New IPFS hash of the warranty document
     */
    function updateWarrantyDocument(
        string memory _imei,
        string memory _newIPFSHash
    ) external {
        // Check if warranty exists
        if (bytes(warranties[_imei].imeiNumber).length == 0) revert NoWarrantyFound();
        
        // Only original issuer can update
        if (warranties[_imei].issuer != msg.sender) revert UnauthorizedAccess();
        
        // Validate new IPFS hash
        if (bytes(_newIPFSHash).length == 0) revert InvalidIPFSHash();
        
        // Update IPFS hash
        warranties[_imei].ipfsHash = _newIPFSHash;
        
        emit WarrantyUpdated(msg.sender, _imei, _newIPFSHash);
    }

    /**
     * @dev Extend warranty period
     * @param _imei Device IMEI number
     * @param _newWarrantyEndDate New warranty end date
     */
    function extendWarranty(
        string memory _imei,
        uint256 _newWarrantyEndDate
    ) external {
        // Check if warranty exists
        if (bytes(warranties[_imei].imeiNumber).length == 0) revert NoWarrantyFound();
        
        // Only original issuer can extend
        if (warranties[_imei].issuer != msg.sender) revert UnauthorizedAccess();
        
        // Ensure new date is later than current end date
        if (_newWarrantyEndDate <= warranties[_imei].warrantyEndDate) revert InvalidWarrantyPeriod();
        
        // Update warranty end date
        warranties[_imei].warrantyEndDate = _newWarrantyEndDate;
    }

    /**
     * @dev Get warranty details by IMEI number
     * @param _imei Device IMEI number
     * @return Warranty details
     */
    function getWarrantyByIMEI(string memory _imei) external view returns (Warranty memory) {
        if (bytes(warranties[_imei].imeiNumber).length == 0) revert NoWarrantyFound();
        return warranties[_imei];
    }

    /**
     * @dev Check if a warranty is valid (exists and not expired)
     * @param _imei Device IMEI number
     * @return isValid Whether warranty is valid
     * @return endDate Warranty end date (0 if not valid)
     */
    function isWarrantyValid(string memory _imei) external view returns (bool isValid, uint256 endDate) {
        // Check if warranty exists
        if (bytes(warranties[_imei].imeiNumber).length == 0) {
            return (false, 0);
        }
        
        // Check if warranty is expired
        Warranty memory warranty = warranties[_imei];
        isValid = warranty.warrantyEndDate > block.timestamp;
        endDate = warranty.warrantyEndDate;
        
        return (isValid, endDate);
    }

    /**
     * @dev Get all warranties issued by caller
     * @return Array of IMEI numbers issued by caller
     */
    function getIssuerWarranties() external view returns (string[] memory) {
        return issuerToIMEIs[msg.sender];
    }

    /**
     * @dev Get total number of warranties stored
     * @return count Total warranty count
     */
    function getTotalWarrantyCount() external view returns (uint256) {
        return allIMEIs.length;
    }
}