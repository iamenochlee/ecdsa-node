import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

export default function toHexHash(message) {
  const messageBytes = utf8ToBytes(JSON.stringify(message));
  const messsageHash = keccak256(messageBytes);
  return toHex(messsageHash);
}
