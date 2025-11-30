// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./IHumanIdentity.sol";
import "./ProofRegistry.sol";

/**
 * @title PoSHNFT
 * @notice Soulbound NFT representing Proof of Sustainable Humanity
 * @dev Non-transferable by default (soulbound). Can mint per-event or aggregated.
 * 
 * Design Principles:
 * - Soulbound: cannot be transferred (proves YOUR actions)
 * - Aggregatable: can bundle multiple proofs into one NFT
 * - Composable: other dApps can query for PoSH status
 */
contract PoSHNFT is ERC721, ERC721URIStorage {
    // ============ Types ============
    
    struct NFTMetadata {
        bytes32 humanId;
        bytes32[] proofIds;
        uint256 totalCO2e;        // Total CO2e avoided (grams)
        uint256 totalEnergy;      // Total renewable energy (Wh)
        uint256 mintTimestamp;
        string period;            // e.g., "2025-01" or "lifetime"
    }

    // ============ Storage ============
    
    IHumanIdentity public immutable humanIdentity;
    ProofRegistry public immutable proofRegistry;
    
    /// @notice Token ID counter
    uint256 private _nextTokenId;
    
    /// @notice Mapping from tokenId to metadata
    mapping(uint256 => NFTMetadata) public tokenMetadata;
    
    /// @notice Mapping from proofId to tokenId (to prevent double-minting)
    mapping(bytes32 => uint256) public proofToToken;
    
    /// @notice Mapping from humanId to their token IDs
    mapping(bytes32 => uint256[]) public humanTokens;

    // ============ Events ============
    
    event PoSHMinted(
        bytes32 indexed humanId,
        uint256 indexed tokenId,
        uint256 proofCount,
        uint256 totalCO2e
    );

    // ============ Errors ============
    
    error NotHumanOwner();
    error ProofAlreadyMinted();
    error NoProofsProvided();
    error ProofNotOwnedByHuman();
    error SoulboundTransferBlocked();

    // ============ Constructor ============
    
    constructor(
        address _humanIdentity,
        address _proofRegistry
    ) ERC721("Proof of Sustainable Humanity", "POSH") {
        humanIdentity = IHumanIdentity(_humanIdentity);
        proofRegistry = ProofRegistry(_proofRegistry);
    }

    // ============ Minting Functions ============

    /**
     * @notice Mint a PoSH NFT for a bundle of proofs
     * @param proofIds Array of proof IDs to include in this NFT
     * @param metadataURI IPFS/Arweave URI for the NFT metadata
     * @param period Human-readable period (e.g., "2025-01")
     * @return tokenId The minted token ID
     */
    function mintPoSH(
        bytes32[] calldata proofIds,
        string calldata metadataURI,
        string calldata period
    ) external returns (uint256 tokenId) {
        if (proofIds.length == 0) revert NoProofsProvided();
        
        bytes32 humanId = humanIdentity.getHumanId(msg.sender);
        if (humanId == bytes32(0)) revert NotHumanOwner();
        
        uint256 totalCO2e = 0;
        uint256 totalEnergy = 0;
        
        // Validate all proofs belong to this human and haven't been minted
        for (uint256 i = 0; i < proofIds.length; i++) {
            bytes32 proofId = proofIds[i];
            
            if (proofToToken[proofId] != 0) revert ProofAlreadyMinted();
            
            ProofRegistry.Proof memory proof = proofRegistry.getProof(proofId);
            if (proof.humanId != humanId) revert ProofNotOwnedByHuman();
            
            // Aggregate impact values
            // Assuming impactType for CO2e is keccak256("co2e_avoided")
            // and for energy is keccak256("renewable_energy")
            if (proof.impactType == keccak256("co2e_avoided")) {
                totalCO2e += proof.impactValue;
            } else if (proof.impactType == keccak256("renewable_energy")) {
                totalEnergy += proof.impactValue;
                // Convert kWh to estimated CO2e (approximate: 400g CO2/kWh)
                totalCO2e += (proof.impactValue * 400) / 1000;
            }
        }
        
        // Mint the NFT
        tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        // Store metadata
        tokenMetadata[tokenId] = NFTMetadata({
            humanId: humanId,
            proofIds: proofIds,
            totalCO2e: totalCO2e,
            totalEnergy: totalEnergy,
            mintTimestamp: block.timestamp,
            period: period
        });
        
        // Mark proofs as minted
        for (uint256 i = 0; i < proofIds.length; i++) {
            proofToToken[proofIds[i]] = tokenId;
        }
        
        humanTokens[humanId].push(tokenId);
        
        emit PoSHMinted(humanId, tokenId, proofIds.length, totalCO2e);
    }

    // ============ View Functions ============

    /**
     * @notice Get all token IDs owned by a human
     * @param humanId The human to query
     * @return Array of token IDs
     */
    function getHumanTokens(bytes32 humanId) external view returns (uint256[] memory) {
        return humanTokens[humanId];
    }

    /**
     * @notice Get the total CO2e avoided by a human across all NFTs
     * @param humanId The human to query
     * @return Total CO2e in grams
     */
    function getTotalCO2e(bytes32 humanId) external view returns (uint256) {
        uint256[] memory tokens = humanTokens[humanId];
        uint256 total = 0;
        
        for (uint256 i = 0; i < tokens.length; i++) {
            total += tokenMetadata[tokens[i]].totalCO2e;
        }
        
        return total;
    }

    /**
     * @notice Check if a human has any PoSH NFTs
     * @param humanId The human to check
     * @return True if they have at least one PoSH NFT
     */
    function hasPoSH(bytes32 humanId) external view returns (bool) {
        return humanTokens[humanId].length > 0;
    }

    /**
     * @notice Get proof IDs included in a token
     * @param tokenId The token to query
     * @return Array of proof IDs
     */
    function getTokenProofs(uint256 tokenId) external view returns (bytes32[] memory) {
        return tokenMetadata[tokenId].proofIds;
    }

    // ============ Soulbound Overrides ============

    /**
     * @notice Override to make tokens soulbound (non-transferable)
     * @dev Blocks all transfers except minting (from = address(0))
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) but block transfers
        if (from != address(0) && to != address(0)) {
            revert SoulboundTransferBlocked();
        }
        
        return super._update(to, tokenId, auth);
    }

    // ============ Required Overrides ============

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
