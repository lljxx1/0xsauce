pragma solidity ^0.8.0;

pragma experimental ABIEncoderV2;

interface IProofRegistry {
    function verify(address collection, uint256 tokenId, uint256 isBlock, bytes32[] calldata merkleProof) external view returns (bool);
}

contract SwapGuard {

    struct SwapItem {
        address collection;
        uint256 tokenId;
        uint256 isBlock;
        bytes32[] merkleProof;
    }

    IProofRegistry public proofRegistry;

    constructor(address proof_) public {
        proofRegistry = IProofRegistry(proof_);
    }

    function swap(SwapItem[] memory items) public {
        uint256 numSwaps = items.length;
        for (uint256 i; i < numSwaps; ) {
            bool isBlockd = proofRegistry.verify(
                items[i].collection,
                items[i].tokenId,
                items[i].isBlock,
                items[i].merkleProof
            );
            require(!isBlockd, "token blocked");
            // keep swap
        }
    }
}