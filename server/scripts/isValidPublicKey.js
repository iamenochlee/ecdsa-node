const publicKeyRegex = /^(0x)?[0-9a-f]{130}$/;

function isValidPublicKey(publicKey) {
  return Boolean(publicKey.match(publicKeyRegex));
}

module.exports = isValidPublicKey;
