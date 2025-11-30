// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IHumanIdentity
 * @notice Interface for the Human Identity Registry
 * @dev Maps wallet addresses to pseudonymous humanIds for PoSH
 */
interface IHumanIdentity {
    /// @notice Emitted when a new human identity is registered
    event HumanRegistered(
        bytes32 indexed humanId,
        address indexed wallet,
        uint256 timestamp
    );

    /// @notice Emitted when an identity is linked to an external proof
    event IdentityLinked(
        bytes32 indexed humanId,
        bytes32 indexed externalProofHash,
        string provider
    );

    /// @notice Get the humanId for a wallet address
    function getHumanId(address wallet) external view returns (bytes32);

    /// @notice Check if a wallet has a registered identity
    function isRegistered(address wallet) external view returns (bool);

    /// @notice Check if a humanId exists
    function humanExists(bytes32 humanId) external view returns (bool);

    /// @notice Get the wallet address for a humanId
    function getWallet(bytes32 humanId) external view returns (address);

    /// @notice Register a new human identity
    function registerHuman() external returns (bytes32 humanId);

    /// @notice Link an external identity proof (e.g., BrightID, Sismo)
    function linkExternalProof(
        bytes32 externalProofHash,
        string calldata provider,
        bytes calldata signature
    ) external;
}
