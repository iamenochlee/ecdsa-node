import { useState } from "react";
import server from "./server";
import { sign } from "ethereum-cryptography/secp256k1";
import toHexHash from "./utils/toHexHash";

function Transfer({ setBalance, privateKey, publicKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      if (recipient && sendAmount) {
        const message = {
          type: "transaction",
          sender: publicKey,
          recipient,
          sendAmount: parseInt(sendAmount),
        };
        const msgHash = toHexHash(message);
        const signatureResponse = await sign(msgHash, privateKey, {
          recovered: true,
        });
        const {
          data: { balance },
        } = await server.post(`send`, {
          signatureResponse,
          msgHash,
          message,
        });

        setBalance(balance);
        alert("Sent!");
        setSendAmount("");
        setRecipient("");
      } else {
        alert("fill the input");
      }
    } catch (ex) {
      alert(ex.response.data.message);
      console.log("ex", ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type a publicKey, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
