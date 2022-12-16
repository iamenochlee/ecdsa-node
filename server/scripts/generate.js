const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const fs = require("fs");

let privateKeys = {};
const generate = (limit) => {
  let keys = {};
  for (let index = 0; index < limit; index++) {
    const privateKey = toHex(secp.utils.randomPrivateKey());
    const publicKey = toHex(secp.getPublicKey(privateKey));
    console.log(`public key  : ${publicKey}`);
    console.log(`private key : ${privateKey}`);
    keys[publicKey] = Math.floor(Math.random() * 100);
    privateKeys[privateKey] = publicKey;
  }
  return keys;
};

async function storeAddressInFile() {
  fs.writeFileSync("../constants.json", JSON.stringify(generate(4)), "utf-8");
  fs.writeFileSync("./.env", JSON.stringify(privateKeys), "utf-8");
}

storeAddressInFile();
