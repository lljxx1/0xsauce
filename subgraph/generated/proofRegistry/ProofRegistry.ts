// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class NewAdmin extends ethereum.Event {
  get params(): NewAdmin__Params {
    return new NewAdmin__Params(this);
  }
}

export class NewAdmin__Params {
  _event: NewAdmin;

  constructor(event: NewAdmin) {
    this._event = event;
  }

  get oldAdmin(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newAdmin(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class ProofChanged extends ethereum.Event {
  get params(): ProofChanged__Params {
    return new ProofChanged__Params(this);
  }
}

export class ProofChanged__Params {
  _event: ProofChanged;

  constructor(event: ProofChanged) {
    this._event = event;
  }

  get collection(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get merkleRoot(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get url(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class ProofRegistry__getProofResult {
  value0: Address;
  value1: Bytes;
  value2: string;

  constructor(value0: Address, value1: Bytes, value2: string) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromFixedBytes(this.value1));
    map.set("value2", ethereum.Value.fromString(this.value2));
    return map;
  }
}

export class ProofRegistry extends ethereum.SmartContract {
  static bind(address: Address): ProofRegistry {
    return new ProofRegistry("ProofRegistry", address);
  }

  admin(): Address {
    let result = super.call("admin", "admin():(address)", []);

    return result[0].toAddress();
  }

  try_admin(): ethereum.CallResult<Address> {
    let result = super.tryCall("admin", "admin():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getProof(param0: Address): ProofRegistry__getProofResult {
    let result = super.call(
      "getProof",
      "getProof(address):(address,bytes32,string)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new ProofRegistry__getProofResult(
      result[0].toAddress(),
      result[1].toBytes(),
      result[2].toString()
    );
  }

  try_getProof(
    param0: Address
  ): ethereum.CallResult<ProofRegistry__getProofResult> {
    let result = super.tryCall(
      "getProof",
      "getProof(address):(address,bytes32,string)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new ProofRegistry__getProofResult(
        value[0].toAddress(),
        value[1].toBytes(),
        value[2].toString()
      )
    );
  }

  verify(
    collection: Address,
    tokenId: BigInt,
    isBlock: BigInt,
    merkleProof: Array<Bytes>
  ): boolean {
    let result = super.call(
      "verify",
      "verify(address,uint256,uint256,bytes32[]):(bool)",
      [
        ethereum.Value.fromAddress(collection),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(isBlock),
        ethereum.Value.fromFixedBytesArray(merkleProof)
      ]
    );

    return result[0].toBoolean();
  }

  try_verify(
    collection: Address,
    tokenId: BigInt,
    isBlock: BigInt,
    merkleProof: Array<Bytes>
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "verify",
      "verify(address,uint256,uint256,bytes32[]):(bool)",
      [
        ethereum.Value.fromAddress(collection),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(isBlock),
        ethereum.Value.fromFixedBytesArray(merkleProof)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class BatchUpdateCall extends ethereum.Call {
  get inputs(): BatchUpdateCall__Inputs {
    return new BatchUpdateCall__Inputs(this);
  }

  get outputs(): BatchUpdateCall__Outputs {
    return new BatchUpdateCall__Outputs(this);
  }
}

export class BatchUpdateCall__Inputs {
  _call: BatchUpdateCall;

  constructor(call: BatchUpdateCall) {
    this._call = call;
  }

  get proofs(): Array<BatchUpdateCallProofsStruct> {
    return this._call.inputValues[0].value.toTupleArray<
      BatchUpdateCallProofsStruct
    >();
  }
}

export class BatchUpdateCall__Outputs {
  _call: BatchUpdateCall;

  constructor(call: BatchUpdateCall) {
    this._call = call;
  }
}

export class BatchUpdateCallProofsStruct extends ethereum.Tuple {
  get collection(): Address {
    return this[0].toAddress();
  }

  get root(): Bytes {
    return this[1].toBytes();
  }

  get url(): string {
    return this[2].toString();
  }
}

export class SetAdminCall extends ethereum.Call {
  get inputs(): SetAdminCall__Inputs {
    return new SetAdminCall__Inputs(this);
  }

  get outputs(): SetAdminCall__Outputs {
    return new SetAdminCall__Outputs(this);
  }
}

export class SetAdminCall__Inputs {
  _call: SetAdminCall;

  constructor(call: SetAdminCall) {
    this._call = call;
  }

  get newAdmin(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetAdminCall__Outputs {
  _call: SetAdminCall;

  constructor(call: SetAdminCall) {
    this._call = call;
  }
}

export class SetProofCall extends ethereum.Call {
  get inputs(): SetProofCall__Inputs {
    return new SetProofCall__Inputs(this);
  }

  get outputs(): SetProofCall__Outputs {
    return new SetProofCall__Outputs(this);
  }
}

export class SetProofCall__Inputs {
  _call: SetProofCall;

  constructor(call: SetProofCall) {
    this._call = call;
  }

  get proof(): SetProofCallProofStruct {
    return changetype<SetProofCallProofStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }
}

export class SetProofCall__Outputs {
  _call: SetProofCall;

  constructor(call: SetProofCall) {
    this._call = call;
  }
}

export class SetProofCallProofStruct extends ethereum.Tuple {
  get collection(): Address {
    return this[0].toAddress();
  }

  get root(): Bytes {
    return this[1].toBytes();
  }

  get url(): string {
    return this[2].toString();
  }
}
