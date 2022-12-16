import server from "./server";
import { getPublicKey } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { useState } from "react";

function Wallet({
  balance,
  setBalance,
  setPublicKey,
  privateKey,
  setPrivateKey,
}) {
  const [address, setAddress] = useState("");
  const [showError, setShowError] = useState("");

  async function onChange(evt) {
    const privatekeyHex = evt.target.value;
    setPrivateKey(privatekeyHex);
    try {
      const publicKeyArray = getPublicKey(privatekeyHex);
      const publicKeyHex = toHex(publicKeyArray);
      setPublicKey(publicKeyHex);
      const addressBytes = keccak256(publicKeyArray.slice(1));
      const addressHex = toHex(addressBytes.slice(-20));
      setAddress(`0x${addressHex}`);

      if (publicKeyHex) {
        const {
          data: { balance },
        } = await server.get(`balance/${publicKeyHex}`);
        setBalance(balance);
        setShowError(false);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error(error);
      setShowError(true);
      setAddress("");
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        PRIVATE KEY
        <input
          placeholder="Type an private key, for example: 0x1..."
          value={privateKey}
          onChange={onChange}
        />
      </label>
      {showError && <p className="error">Invalid Private Key</p>}
      <p>
        {address
          ? `Address: ${address.slice(0, 6)}...${address.slice(-4)}`
          : "."}
      </p>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
