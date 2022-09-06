// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Proof extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("collection", Value.fromString(""));
    this.set("merkleRoot", Value.fromString(""));
    this.set("url", Value.fromString(""));
    this.set("transactionHash", Value.fromBytes(Bytes.empty()));
    this.set("transactionTime", Value.fromI32(0));
    this.set("accrualBlockNumber", Value.fromI32(0));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Proof entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Proof entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Proof", id.toString(), this);
    }
  }

  static load(id: string): Proof | null {
    return changetype<Proof | null>(store.get("Proof", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get collection(): string {
    let value = this.get("collection");
    return value!.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get merkleRoot(): string {
    let value = this.get("merkleRoot");
    return value!.toString();
  }

  set merkleRoot(value: string) {
    this.set("merkleRoot", Value.fromString(value));
  }

  get url(): string {
    let value = this.get("url");
    return value!.toString();
  }

  set url(value: string) {
    this.set("url", Value.fromString(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }

  get transactionTime(): i32 {
    let value = this.get("transactionTime");
    return value!.toI32();
  }

  set transactionTime(value: i32) {
    this.set("transactionTime", Value.fromI32(value));
  }

  get accrualBlockNumber(): i32 {
    let value = this.get("accrualBlockNumber");
    return value!.toI32();
  }

  set accrualBlockNumber(value: i32) {
    this.set("accrualBlockNumber", Value.fromI32(value));
  }
}
