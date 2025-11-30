// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IHumanIdentity.sol";

/**
 * @title HumanIdentity
 * @notice Registry for pseudonymous human identities in the PoSH system
 * @dev Phase 0: Simple wallet-based identity. Future phases will add ZK proofs.
 * 
 * Design Principles:
 * - 1 wallet → 1 humanId (pseudonymous, deterministic)
 * - Non-extractive: only gas costs
 * - Extensible: can link external identity proofs later
 */
contract HumanIdentity is IHumanIdentity {
    // ============ Storage ============
    
    /// @notice Mapping from wallet address to humanId
    mapping(address => bytes32) private _walletToHuman;
    
    /// @notice Mapping from humanId to wallet address
    mapping(bytes32 => address) private _humanToWallet;
    
    /// @notice Mapping from humanId to registration timestamp
    mapping(bytes32 => uint256) private _registrationTime;
    
    /// @notice Mapping from humanId to external proof hashes
    mapping(bytes32 => bytes32[]) private _externalProofs;
    
    /// @notice Mapping from external proof hash to provider name
    mapping(bytes32 => string) private _proofProviders;
    
    /// @notice Total number of registered humans
    uint256 public totalHumans;

    // ============ Errors ============
    
    error AlreadyRegistered();
    error NotRegistered();
    error InvalidProof();
    error ZeroAddress();

    // ============ External Functions ============

    /**
     * @notice Register a new human identity
     * @dev Creates a deterministic humanId from the wallet address
     * @return humanId The newly created human identifier
     */
    function registerHuman() external override returns (bytes32 humanId) {
        if (_walletToHuman[msg.sender] != bytes32(0)) {
            revert AlreadyRegistered();
        }
        
        // Create deterministic humanId from wallet + block data for uniqueness
        humanId = keccak256(
            abi.encodePacked(
                msg.sender,
                block.chainid,
                "HUMAN0_POSH_V1"
            )
        );
        
        _walletToHuman[msg.sender] = humanId;
        _humanToWallet[humanId] = msg.sender;
        _registrationTime[humanId] = block.timestamp;
        
        unchecked {
            ++totalHumans;
        }
        
        emit HumanRegistered(humanId, msg.sender, block.timestamp);
    }

    /**
     * @notice Link an external identity proof to your humanId
     * @param externalProofHash Hash of the external proof data
     * @param provider Name of the identity provider (e.g., "brightid", "sismo")
     * @param signature Signature from the oracle/verifier (for future use)
     */
    function linkExternalProof(
        bytes32 externalProofHash,
        string calldata provider,
        bytes calldata signature
    ) external override {
        bytes32 humanId = _walletToHuman[msg.sender];
        if (humanId == bytes32(0)) {
            revert NotRegistered();
        }
        
        // TODO: Verify signature from trusted oracle in Phase 1
        // For Phase 0, we accept the proof hash directly
        (signature); // Silence unused variable warning
        
        _externalProofs[humanId].push(externalProofHash);
        _proofProviders[externalProofHash] = provider;
        
        emit IdentityLinked(humanId, externalProofHash, provider);
    }

    // ============ View Functions ============

    /**
     * @notice Get the humanId for a wallet address
     * @param wallet The wallet address to query
     * @return The humanId, or bytes32(0) if not registered
     */
    function getHumanId(address wallet) external view override returns (bytes32) {
        return _walletToHuman[wallet];
    }

    /**
     * @notice Check if a wallet has a registered identity
     * @param wallet The wallet address to check
     * @return True if registered
     */
    function isRegistered(address wallet) external view override returns (bool) {
        return _walletToHuman[wallet] != bytes32(0);
    }

    /**
     * @notice Check if a humanId exists
     * @param humanId The humanId to check
     * @return True if exists
     */
    function humanExists(bytes32 humanId) external view override returns (bool) {
        return _humanToWallet[humanId] != address(0);
    }

    /**
     * @notice Get the wallet address for a humanId
     * @param humanId The humanId to query
     * @return The wallet address
     */
    function getWallet(bytes32 humanId) external view override returns (address) {
        return _humanToWallet[humanId];
    }

    /**
     * @notice Get registration timestamp for a humanId
     * @param humanId The humanId to query
     * @return Unix timestamp of registration
     */
    function getRegistrationTime(bytes32 humanId) external view returns (uint256) {
        return _registrationTime[humanId];
    }

    /**
     * @notice Get all external proofs linked to a humanId
     * @param humanId The humanId to query
     * @return Array of external proof hashes
     */
    function getExternalProofs(bytes32 humanId) external view returns (bytes32[] memory) {
        return _externalProofs[humanId];
    }

    /**
     * @notice Get the provider name for an external proof
     * @param proofHash The proof hash to query
     * @return Provider name
     */
    function getProofProvider(bytes32 proofHash) external view returns (string memory) {
        return _proofProviders[proofHash];
    }
}
