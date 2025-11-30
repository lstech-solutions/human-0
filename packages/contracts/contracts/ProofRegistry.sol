// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IHumanIdentity.sol";

/**
 * @title ProofRegistry
 * @notice Stores canonical, deduplicated sustainability impact proofs
 * @dev Core component of the PoSH (Proof of Sustainable Humanity) system
 * 
 * Design Principles:
 * - Verifiable: every claim rooted in MRV (Measurement/Reporting/Verification)
 * - Non-extractive: only gas costs, no protocol tax
 * - Privacy-preserving: stores hashes, not raw data
 */
contract ProofRegistry {
    // ============ Types ============
    
    struct Proof {
        bytes32 humanId;           // Pseudonymous human identifier
        bytes32 impactType;        // keccak256("renewable_energy"), etc.
        uint256 impactValue;       // Canonical units (e.g., Wh, grams CO2e)
        bytes32 methodologyHash;   // Versioned methodology reference
        bytes32 verificationHash;  // Ties back to off-chain MRV bundle
        uint64 timestamp;          // When the impact occurred
        uint8 tier;                // Quality tier: 1=A (verified), 2=B (partial), 3=C (self-reported)
    }

    // ============ Storage ============
    
    /// @notice Human Identity Registry
    IHumanIdentity public immutable humanIdentity;
    
    /// @notice Mapping from proofId to Proof data
    mapping(bytes32 => Proof) public proofs;
    
    /// @notice Mapping from humanId to their proof IDs
    mapping(bytes32 => bytes32[]) public humanProofs;
    
    /// @notice Mapping to prevent double-use of verification hashes
    mapping(bytes32 => bool) public usedVerification;
    
    /// @notice Authorized oracle addresses
    mapping(address => bool) public authorizedOracles;
    
    /// @notice Total number of proofs registered
    uint256 public totalProofs;
    
    /// @notice Contract owner (for Phase 0 oracle management)
    address public owner;

    // ============ Events ============
    
    event ProofRegistered(
        bytes32 indexed humanId,
        bytes32 indexed proofId,
        bytes32 indexed impactType,
        uint256 impactValue,
        uint8 tier
    );
    
    event OracleAuthorized(address indexed oracle, bool authorized);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ============ Errors ============
    
    error UnauthorizedOracle();
    error InvalidSignature();
    error VerificationAlreadyUsed();
    error HumanNotRegistered();
    error InvalidProofData();
    error OnlyOwner();

    // ============ Modifiers ============
    
    modifier onlyOracle() {
        if (!authorizedOracles[msg.sender]) revert UnauthorizedOracle();
        _;
    }
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    // ============ Constructor ============
    
    constructor(address _humanIdentity) {
        humanIdentity = IHumanIdentity(_humanIdentity);
        owner = msg.sender;
        authorizedOracles[msg.sender] = true; // Owner is initial oracle for Phase 0
    }

    // ============ Oracle Functions ============

    /**
     * @notice Submit a verified impact proof (called by authorized oracles)
     * @param humanId The human who performed the sustainable action
     * @param impactType Type of impact (e.g., keccak256("renewable_energy"))
     * @param impactValue Value in canonical units
     * @param methodologyHash Reference to the verification methodology
     * @param verificationHash Unique hash of the MRV data bundle
     * @param timestamp When the impact occurred
     * @param tier Quality tier (1=A, 2=B, 3=C)
     * @param oracleSignature Oracle's signature over the claim (for multi-sig in Phase 2)
     * @return proofId The unique identifier for this proof
     */
    function submitProof(
        bytes32 humanId,
        bytes32 impactType,
        uint256 impactValue,
        bytes32 methodologyHash,
        bytes32 verificationHash,
        uint64 timestamp,
        uint8 tier,
        bytes calldata oracleSignature
    ) external onlyOracle returns (bytes32 proofId) {
        // Validate inputs
        if (!humanIdentity.humanExists(humanId)) revert HumanNotRegistered();
        if (usedVerification[verificationHash]) revert VerificationAlreadyUsed();
        if (impactValue == 0) revert InvalidProofData();
        if (tier == 0 || tier > 3) revert InvalidProofData();
        
        // TODO: Verify multi-sig in Phase 2
        (oracleSignature); // Silence unused variable warning
        
        // Generate unique proof ID
        proofId = keccak256(
            abi.encodePacked(
                humanId,
                verificationHash,
                block.chainid,
                totalProofs
            )
        );
        
        // Store proof
        proofs[proofId] = Proof({
            humanId: humanId,
            impactType: impactType,
            impactValue: impactValue,
            methodologyHash: methodologyHash,
            verificationHash: verificationHash,
            timestamp: timestamp,
            tier: tier
        });
        
        humanProofs[humanId].push(proofId);
        usedVerification[verificationHash] = true;
        
        unchecked {
            ++totalProofs;
        }
        
        emit ProofRegistered(humanId, proofId, impactType, impactValue, tier);
    }

    // ============ View Functions ============

    /**
     * @notice Get all proof IDs for a human
     * @param humanId The human to query
     * @return Array of proof IDs
     */
    function getHumanProofIds(bytes32 humanId) external view returns (bytes32[] memory) {
        return humanProofs[humanId];
    }

    /**
     * @notice Get proof count for a human
     * @param humanId The human to query
     * @return Number of proofs
     */
    function getHumanProofCount(bytes32 humanId) external view returns (uint256) {
        return humanProofs[humanId].length;
    }

    /**
     * @notice Get full proof data
     * @param proofId The proof to query
     * @return The Proof struct
     */
    function getProof(bytes32 proofId) external view returns (Proof memory) {
        return proofs[proofId];
    }

    /**
     * @notice Calculate total impact value for a human by type
     * @param humanId The human to query
     * @param impactType The type of impact to sum
     * @return Total impact value
     */
    function getTotalImpact(
        bytes32 humanId,
        bytes32 impactType
    ) external view returns (uint256) {
        bytes32[] memory proofIds = humanProofs[humanId];
        uint256 total = 0;
        
        for (uint256 i = 0; i < proofIds.length; i++) {
            Proof memory p = proofs[proofIds[i]];
            if (p.impactType == impactType) {
                total += p.impactValue;
            }
        }
        
        return total;
    }

    // ============ Admin Functions ============

    /**
     * @notice Authorize or revoke an oracle
     * @param oracle The oracle address
     * @param authorized Whether to authorize or revoke
     */
    function setOracleAuthorization(address oracle, bool authorized) external onlyOwner {
        authorizedOracles[oracle] = authorized;
        emit OracleAuthorized(oracle, authorized);
    }

    /**
     * @notice Transfer ownership
     * @param newOwner The new owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
