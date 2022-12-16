import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        publicKey={publicKey}
        setPublicKey={setPublicKey}
        setPrivateKey={setPrivateKey}
      />
      <Transfer
        setBalance={setBalance}
        privateKey={privateKey}
        publicKey={publicKey}
      />
    </div>
  );
}

export default App;
