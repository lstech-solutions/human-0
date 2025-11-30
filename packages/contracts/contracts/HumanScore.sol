// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IHumanIdentity.sol";
import "./ProofRegistry.sol";

/**
 * @title HumanScore
 * @notice Aggregates PoSH proofs into a queryable reputation score
 * @dev Provides weighted scoring based on impact type and verification tier
 * 
 * Design Principles:
 * - Transparent: scoring algorithm is open-source and on-chain
 * - Weighted: higher-quality MRV sources get more weight
 * - Composable: other protocols can use scores for gating/weighting
 */
contract HumanScore {
    // ============ Constants ============
    
    /// @notice Impact type identifiers
    bytes32 public constant RENEWABLE_ENERGY = keccak256("renewable_energy");
    bytes32 public constant CO2E_AVOIDED = keccak256("co2e_avoided");
    bytes32 public constant TREES_PLANTED = keccak256("trees_planted");
    bytes32 public constant EV_CHARGING = keccak256("ev_charging");
    bytes32 public constant SUSTAINABLE_PURCHASE = keccak256("sustainable_purchase");
    
    /// @notice Tier multipliers (basis points: 10000 = 1x)
    uint256 public constant TIER_A_MULTIPLIER = 10000; // 1.0x for verified
    uint256 public constant TIER_B_MULTIPLIER = 5000;  // 0.5x for partial
    uint256 public constant TIER_C_MULTIPLIER = 1000;  // 0.1x for self-reported
    
    /// @notice Score decay: 10% per year (in basis points per second)
    uint256 public constant DECAY_RATE_BPS_PER_YEAR = 1000; // 10%
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    // ============ Storage ============
    
    IHumanIdentity public immutable humanIdentity;
    ProofRegistry public immutable proofRegistry;
    
    /// @notice Impact type weights (basis points: 10000 = 1x)
    mapping(bytes32 => uint256) public impactWeights;

    // ============ Events ============
    
    event ImpactWeightUpdated(bytes32 indexed impactType, uint256 weight);

    // ============ Constructor ============
    
    constructor(address _humanIdentity, address _proofRegistry) {
        humanIdentity = IHumanIdentity(_humanIdentity);
        proofRegistry = ProofRegistry(_proofRegistry);
        
        // Initialize default weights
        impactWeights[RENEWABLE_ENERGY] = 10000;    // 1.0x
        impactWeights[CO2E_AVOIDED] = 10000;        // 1.0x
        impactWeights[TREES_PLANTED] = 15000;       // 1.5x (high impact)
        impactWeights[EV_CHARGING] = 8000;          // 0.8x
        impactWeights[SUSTAINABLE_PURCHASE] = 5000; // 0.5x
    }

    // ============ View Functions ============

    /**
     * @notice Get the overall PoSH score for a human
     * @param humanId The human to query
     * @return score The weighted, time-decayed score
     */
    function getHumanScore(bytes32 humanId) external view returns (uint256 score) {
        bytes32[] memory proofIds = proofRegistry.getHumanProofIds(humanId);
        
        for (uint256 i = 0; i < proofIds.length; i++) {
            ProofRegistry.Proof memory proof = proofRegistry.getProof(proofIds[i]);
            
            // Calculate base score for this proof
            uint256 baseScore = proof.impactValue;
            
            // Apply impact type weight
            uint256 typeWeight = impactWeights[proof.impactType];
            if (typeWeight == 0) typeWeight = 10000; // Default 1x
            
            // Apply tier multiplier
            uint256 tierMultiplier = _getTierMultiplier(proof.tier);
            
            // Apply time decay
            uint256 decayMultiplier = _getDecayMultiplier(proof.timestamp);
            
            // Calculate weighted score
            // score = baseScore * typeWeight * tierMultiplier * decayMultiplier / (10000^3)
            uint256 proofScore = (baseScore * typeWeight * tierMultiplier * decayMultiplier) / (10000 * 10000 * 10000);
            
            score += proofScore;
        }
    }

    /**
     * @notice Get breakdown of impact by type for a human
     * @param humanId The human to query
     * @param impactType The type of impact to query
     * @return totalValue Raw total value
     * @return weightedValue Weighted value after tier adjustments
     */
    function getImpactBreakdown(
        bytes32 humanId,
        bytes32 impactType
    ) external view returns (uint256 totalValue, uint256 weightedValue) {
        bytes32[] memory proofIds = proofRegistry.getHumanProofIds(humanId);
        
        for (uint256 i = 0; i < proofIds.length; i++) {
            ProofRegistry.Proof memory proof = proofRegistry.getProof(proofIds[i]);
            
            if (proof.impactType == impactType) {
                totalValue += proof.impactValue;
                
                uint256 tierMultiplier = _getTierMultiplier(proof.tier);
                weightedValue += (proof.impactValue * tierMultiplier) / 10000;
            }
        }
    }

    /**
     * @notice Get the score level/tier for a human
     * @param humanId The human to query
     * @return level 0=None, 1=Bronze, 2=Silver, 3=Gold, 4=Platinum, 5=Diamond
     */
    function getHumanLevel(bytes32 humanId) external view returns (uint8 level) {
        uint256 score = this.getHumanScore(humanId);
        
        if (score >= 1000000) return 5;      // Diamond: 1M+
        if (score >= 100000) return 4;       // Platinum: 100K+
        if (score >= 10000) return 3;        // Gold: 10K+
        if (score >= 1000) return 2;         // Silver: 1K+
        if (score >= 100) return 1;          // Bronze: 100+
        return 0;                            // None
    }

    /**
     * @notice Check if a human meets a minimum score threshold
     * @param humanId The human to check
     * @param minScore Minimum required score
     * @return True if score >= minScore
     */
    function meetsThreshold(bytes32 humanId, uint256 minScore) external view returns (bool) {
        return this.getHumanScore(humanId) >= minScore;
    }

    /**
     * @notice Get proof count by tier for a human
     * @param humanId The human to query
     * @return tierA Count of Tier A (verified) proofs
     * @return tierB Count of Tier B (partial) proofs
     * @return tierC Count of Tier C (self-reported) proofs
     */
    function getProofCountByTier(bytes32 humanId) 
        external 
        view 
        returns (uint256 tierA, uint256 tierB, uint256 tierC) 
    {
        bytes32[] memory proofIds = proofRegistry.getHumanProofIds(humanId);
        
        for (uint256 i = 0; i < proofIds.length; i++) {
            ProofRegistry.Proof memory proof = proofRegistry.getProof(proofIds[i]);
            
            if (proof.tier == 1) tierA++;
            else if (proof.tier == 2) tierB++;
            else if (proof.tier == 3) tierC++;
        }
    }

    // ============ Internal Functions ============

    /**
     * @notice Get the multiplier for a verification tier
     * @param tier The tier (1=A, 2=B, 3=C)
     * @return Multiplier in basis points
     */
    function _getTierMultiplier(uint8 tier) internal pure returns (uint256) {
        if (tier == 1) return TIER_A_MULTIPLIER;
        if (tier == 2) return TIER_B_MULTIPLIER;
        if (tier == 3) return TIER_C_MULTIPLIER;
        return TIER_C_MULTIPLIER; // Default to lowest
    }

    /**
     * @notice Calculate time decay multiplier
     * @param timestamp When the proof was created
     * @return Multiplier in basis points (10000 = no decay)
     */
    function _getDecayMultiplier(uint64 timestamp) internal view returns (uint256) {
        if (block.timestamp <= timestamp) return 10000;
        
        uint256 elapsed = block.timestamp - timestamp;
        uint256 decayBps = (elapsed * DECAY_RATE_BPS_PER_YEAR) / SECONDS_PER_YEAR;
        
        // Cap decay at 90% (minimum 10% retained)
        if (decayBps >= 9000) return 1000;
        
        return 10000 - decayBps;
    }
}
