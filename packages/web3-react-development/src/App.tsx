import React from "react";
import { ConnectWallet, useWeb3 } from "@fewcha/web3-react";
import Web3, { Web3Provider } from "@fewcha/web3";
import "./App.css";

const Account = () => {
  const aptos = useWeb3();
  const [signed, setSigned] = React.useState("");
  const { account, balance, isConnected, connect, disconnect, network } = aptos;

  const fewcha = (window as any).fewcha;
  const provider = new Web3Provider(fewcha);
  const web3 = new Web3(provider);

  const parseError = (status: number): boolean => {
    switch (status) {
      case 200:
        return true;
      case 400:
        alert("bad request");
        return false;
      case 401:
        alert("User denied");
        return false;
      case 403:
        alert("Forbidden: please connect wallet");
        return false;
      case 404:
        alert("Not Found");
        return false;
      case 500:
        alert("Internal Server Error");
        return false;
      case 502:
        alert("Bad Gateway");
        return false;
      case 503:
        alert("Service Unavailable");
        return false;
      default:
        alert("Unknown Error");
        return false;
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          web3.action
            .connect()
            .then((data) => parseError(data.status) && console.log(data))
            .catch(console.log)
            .finally(console.log);
        }}
      >
        Connnect
      </button>
      <button
        onClick={() => {
          web3.action
            .isConnected()
            .then((data) => parseError(data.status) && console.log(data))
            .catch(console.log)
            .finally(console.log);
        }}
      >
        IsConnnect
      </button>
      <button
        onClick={() => {
          web3.action
            .disconnect()
            .then((data) => parseError(data.status) && console.log(data))
            .catch(console.log)
            .finally(console.log);
        }}
      >
        Disconnect
      </button>
      <button
        onClick={() => {
          web3.action
            .account()
            .then((data) => parseError(data.status) && console.log(data))
            .catch(console.log)
            .finally(console.log);
        }}
      >
        Account
      </button>
      <button
        onClick={() => {
          web3.action
            .getNetwork()
            .then((data) => parseError(data.status) && console.log(data))
            .catch(console.log)
            .finally(console.log);
        }}
      >
        Get Network
      </button>
      <button
        onClick={() => {
          web3.action
            .getBalance()
            .then((data) => parseError(data.status) && console.log(data))
            .catch(console.log)
            .finally(console.log);
        }}
      >
        Get Balance
      </button>
      <button
        onClick={async () => {
          const receiverAddress = "0x788b3f37e8925b444fafa49becee9bd4489b1ef1a4005fdd6eac47e4e6d71531";
          const sendBalance = "1000";
          const payload = {
            type: "script_function_payload",
            function: "0x1::coin::transfer",
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: [receiverAddress, sendBalance],
          };

          const txnRequest = await web3.action.generateTransaction(payload);
          if (!parseError(txnRequest.status)) {
            return;
          }
          const transactionEstRes = await web3.action.simulateTransaction(txnRequest.data);
          if (!parseError(transactionEstRes.status)) {
            return;
          }

          if (transactionEstRes.data.success) {
            console.log(transactionEstRes.data.gas_used, "gas_used");
          } else {
            console.log(transactionEstRes.data.vm_status, "vm_status");
          }

          const txnHash = await web3.action.signAndSubmitTransaction(txnRequest.data);
          if (!parseError(txnHash.status)) {
            return;
          }

          console.log(txnHash.data, "txnHash");
        }}
      >
        Sign TX
      </button>
      <div>
        {isConnected ? (
          <div>
            <div>Address: {account.address}</div>
            <div>Balance: {balance || "0"}</div>
            <div>Network: {network}</div>
            <div>Signed: {signed}</div>
            <div>Connect: </div>
            <button
            // onClick={() => {
            //   web3.signMessage("hello world").then((data) => {
            //     setSigned(data);
            //   });
            // }}
            >
              Sign
            </button>
            <button
            // onClick={() => {
            //   web3.sdk
            //     .getTransaction("0xea2bc550356432d3e2ff23f12a859e5c5824aa61e469da9fe02539beabc55490")
            //     .then((data) => console.log(data, "longheo"))
            //     .catch((e) => console.log("error longheo", e));
            //   (web3.submitTransaction as any)();
            // }}
            >
              tx
            </button>

            <div>
              <button
                onClick={() => {
                  disconnect();
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <ConnectWallet type="list" />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <header>
        <Account />
      </header>
    </>
  );
};

export default App;
