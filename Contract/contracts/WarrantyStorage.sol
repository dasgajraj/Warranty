// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract WarrantyStorage {
    // Custom errors for better gas efficiency
    error NoWarrantyFound();
    error UnauthorizedAccess();
    error InvalidIMEI();
    error InvalidWarrantyPeriod();
    error InvalidIPFSHash();
    error InvalidOwnerAddress();
    error NotAdmin();

    struct Warranty {
        string ipfsHash;          // IPFS hash of warranty document
        uint256 warrantyEndDate;  // Timestamp when warranty expires
        string imeiNumber;        // Device IMEI number
        address issuer;           // Retailer/company who issued the warranty
        uint256 issueDate;        // When the warranty was issued
        address currentOwner;     // Current owner of the warranty (can be transferred)
    }

    // Main warranty storage - maps IMEI to warranty details
    mapping(string => Warranty) private warranties;
    
    // Track all IMEIs for warranty lookup
    string[] private allIMEIs;
    
    // Track which IMEIs were registered by which issuer
    mapping(address => string[]) private issuerToIMEIs;
    
    // Track which IMEIs are owned by which address
    mapping(address => string[]) private ownerToIMEIs;
    
    // Admin address who can perform warranty transfers
    address private admin;
    
    // Constructor to set admin
    constructor() {
        admin = msg.sender;
    }

    // Events for better tracking and indexing
    event WarrantyStored(
        address indexed issuer,
        string ipfsHash,
        uint256 warrantyEndDate,
        string imeiNumber,
        uint256 issueDate,
        address indexed owner
    );

    event WarrantyUpdated(
        address indexed issuer,
        string imeiNumber,
        string newIpfsHash
    );
    
    event WarrantyTransferred(
        string imeiNumber,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 transferDate
    );
    
    event AdminChanged(
        address indexed previousAdmin,
        address indexed newAdmin
    );

    // Modifier to restrict functions to admin only
    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    /**
     * @dev Transfer admin privileges to a new address
     * @param _newAdmin Address of the new admin
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        if (_newAdmin == address(0)) revert InvalidOwnerAddress();
        address previousAdmin = admin;
        admin = _newAdmin;
        emit AdminChanged(previousAdmin, _newAdmin);
    }

    /**
     * @dev Stores a new warranty record
     * @param _ipfsHash IPFS hash of the warranty document
     * @param _warrantyEndDate Unix timestamp when warranty expires
     * @param _imei Device IMEI number
     * @param _initialOwner Address of the initial owner (can be same as issuer or different)
     */
    function storeWarranty(
        string memory _ipfsHash,
        uint256 _warrantyEndDate,
        string memory _imei,
        address _initialOwner
    ) public {
        // Validate inputs
        if (bytes(_ipfsHash).length == 0) revert InvalidIPFSHash();
        if (_warrantyEndDate <= block.timestamp) revert InvalidWarrantyPeriod();
        if (bytes(_imei).length == 0) revert InvalidIMEI();
        if (_initialOwner == address(0)) revert InvalidOwnerAddress();

        // Ensure this IMEI hasn't been registered before
        if (bytes(warranties[_imei].imeiNumber).length > 0) {
            // IMEI already exists, only original issuer can update
            if (warranties[_imei].issuer != msg.sender) revert UnauthorizedAccess();
        } else {
            // New IMEI, add to tracking arrays
            allIMEIs.push(_imei);
            issuerToIMEIs[msg.sender].push(_imei);
            ownerToIMEIs[_initialOwner].push(_imei);
        }

        // Store warranty details
        warranties[_imei] = Warranty({
            ipfsHash: _ipfsHash,
            warrantyEndDate: _warrantyEndDate,
            imeiNumber: _imei,
            issuer: msg.sender,
            issueDate: block.timestamp,
            currentOwner: _initialOwner
        });

        emit WarrantyStored(msg.sender, _ipfsHash, _warrantyEndDate, _imei, block.timestamp, _initialOwner);
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
     * @dev Transfer warranty ownership to a new address - ADMIN ONLY
     * @param _imei Device IMEI number
     * @param _newOwner Address of the new owner
     */
    function transferWarrantyOwnership(
        string memory _imei,
        address _newOwner
    ) external onlyAdmin {
        // Check if warranty exists
        if (bytes(warranties[_imei].imeiNumber).length == 0) revert NoWarrantyFound();
        
        // Validate new owner address
        if (_newOwner == address(0)) revert InvalidOwnerAddress();
        
        address previousOwner = warranties[_imei].currentOwner;
        
        // Update owner in warranty struct
        warranties[_imei].currentOwner = _newOwner;
        
        // Update owner-to-IMEIs mapping
        // Remove from previous owner's list
        _removeIMEIFromOwnerList(previousOwner, _imei);
        
        // Add to new owner's list
        ownerToIMEIs[_newOwner].push(_imei);
        
        emit WarrantyTransferred(_imei, previousOwner, _newOwner, block.timestamp);
    }
    
    /**
     * @dev Helper function to remove IMEI from an owner's list
     * @param _owner Owner address
     * @param _imei IMEI to remove
     */
    function _removeIMEIFromOwnerList(address _owner, string memory _imei) private {
        string[] storage imeis = ownerToIMEIs[_owner];
        for (uint i = 0; i < imeis.length; i++) {
            if (keccak256(bytes(imeis[i])) == keccak256(bytes(_imei))) {
                // Replace with the last element and pop
                imeis[i] = imeis[imeis.length - 1];
                imeis.pop();
                break;
            }
        }
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
     * @dev Get all warranties owned by caller
     * @return Array of IMEI numbers owned by caller
     */
    function getOwnedWarranties() external view returns (string[] memory) {
        return ownerToIMEIs[msg.sender];
    }
    
    /**
     * @dev Get all warranties owned by a specific address - ADMIN ONLY
     * @param _owner Address to check
     * @return Array of IMEI numbers owned by the address
     */
    function getWarrantiesByOwner(address _owner) external view onlyAdmin returns (string[] memory) {
        return ownerToIMEIs[_owner];
    }

    /**
     * @dev Get total number of warranties stored
     * @return count Total warranty count
     */
    function getTotalWarrantyCount() external view returns (uint256) {
        return allIMEIs.length;
    }
    
    /**
     * @dev Check if caller is the admin
     * @return True if caller is admin
     */
    function isAdmin() external view returns (bool) {
        return msg.sender == admin;
    }
    
    /**
     * @dev Get the current admin address - only admin can call
     * @return Admin address
     */
    function getAdmin() external view onlyAdmin returns (address) {
        return admin;
    }
}