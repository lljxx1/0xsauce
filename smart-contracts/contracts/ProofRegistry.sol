pragma solidity ^0.8.0;

pragma experimental ABIEncoderV2;

contract ProofRegistry {

    address public admin;

    struct Proof {
        address collection;
        bytes32 root;
        string url;
    }   

    mapping(address => Proof) public getProof;

    event ProofChanged(address collection, bytes32 merkleRoot, string url);
    event NewAdmin(address oldAdmin, address newAdmin);

    constructor() public {
        admin = msg.sender;
    }

    function setProof(Proof memory proof) public onlyAdmin() {
        getProof[proof.collection] = proof;
        emit ProofChanged(proof.collection, proof.root, proof.url);
    }

    function batchUpdate(Proof[] memory proofs) public onlyAdmin() {
        for (uint j = 0; j < proofs.length; j++) {
            setProof(proofs[j]);
        }
    }

    function verifyProof(
        bytes32 root,
        bytes32 leaf,
        bytes32[] memory proof
    )
        private
        pure
        returns (bool)
    {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash == root;
    }

    function verify(address collection, uint256 tokenId, uint256 isBlock, bytes32[] calldata merkleProof) external view returns (bool) {
        Proof memory proof = getProof[collection];
        require(proof.root != bytes32(0), "ProofRegistry: Merkle root not set");
        bytes32 leaf = keccak256(abi.encodePacked(tokenId, isBlock));
        bool valid = verifyProof(proof.root, leaf, merkleProof);
        require(valid, "ProofRegistry: Valid proof required.");
        return isBlock > 0 ? true : false;
    }

    function setAdmin(address newAdmin) external onlyAdmin() {
        address oldAdmin = admin;
        admin = newAdmin;
        emit NewAdmin(oldAdmin, newAdmin);
    }

    modifier onlyAdmin() {
      require(msg.sender == admin, "only admin may call");
      _;
    }
}