import { BigInt } from "@graphprotocol/graph-ts"
import {
  ProofChanged
} from "../generated/proofRegistry/ProofRegistry"
import { Proof } from "../generated/schema"

export function handleProofChanged(event: ProofChanged): void {
  let collection = event.params.collection.toHexString()
  let cTokenStatsID = collection.concat('-').concat(event.transaction.hash.toHexString())
  let proof = new Proof(cTokenStatsID)
  proof.collection = collection;
  proof.merkleRoot = event.params.merkleRoot.toHexString();
  proof.url = event.params.url;
  proof.transactionHash = event.transaction.hash;
  proof.transactionTime = event.block.timestamp.toI32();
  proof.accrualBlockNumber = event.block.number.toI32();
  proof.save()
}