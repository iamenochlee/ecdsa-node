const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const fs = require("fs");
const isValidPublicKey = require("./scripts/isValidPublicKey");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = JSON.parse(fs.readFileSync("../constants.json"));

app.get("/balance/:publicKey", (req, res) => {
  const { publicKey } = req.params;
  const balance = balances[publicKey] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signatureResponse, msgHash, message } = req.body;
  const { type, sender, recipient, sendAmount } = message;
  const signature = Uint8Array.from(Object.values(signatureResponse[0]));
  const isSigned = secp.verify(signature, msgHash, sender);

  const isValid = checkValidity(
    msgHash,
    signature,
    signatureResponse[1],
    sender
  );

  if (isValidPublicKey(recipient)) {
    if (isValid && isSigned) {
      if (type === "transaction") {
        setInitialBalance(sender);
        setInitialBalance(recipient);

        if (balances[sender] < sendAmount) {
          res.status(400).send({ message: "Not enough funds!" });
        } else {
          balances[sender] -= sendAmount;
          balances[recipient] += sendAmount;
          res.send({ balance: balances[sender] });
        }
      } else {
        res.send({ balance: balances[sender] });
      }
    } else {
      res.status(400).send({ message: "Invalid sender!" });
    }
  } else {
    res.status(400).send({ message: "Invalid recipient!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function checkValidity(msgHash, signature, rBit, sender) {
  const recoveredPublicKey = toHex(
    secp.recoverPublicKey(msgHash, signature, rBit)
  );
  return recoveredPublicKey.toString() === sender.toString();
}
