import { Button } from "antd";
import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";

import "./Account.css";

const DEBUG = process.env.NODE_ENV === "development";

/** 
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
    isContract={boolean}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
**/

export default function Account({
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
  showWallet,
}) {
  const { currentTheme } = useThemeSwitcher();
  const signedIn = web3Modal?.cachedProvider;

  let accountButtonInfo;
  if (web3Modal?.cachedProvider) {
    accountButtonInfo = { name: "Logout", action: logoutOfWeb3Modal, size: "small" };
  } else {
    accountButtonInfo = { name: "Connect", action: loadWeb3Modal, size: "large" };
  }

  const display = !minimized && (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {address && (
        <Address
          address={address}
          ensProvider={mainnetProvider}
          blockExplorer={blockExplorer}
          fontSize={15}
        />
      )}
      <Balance address={address} provider={localProvider} price={price} size={20} />
      {!isContract && showWallet && (
        <Wallet
          address={address}
          provider={localProvider}
          signer={userSigner}
          ensProvider={mainnetProvider}
          price={price}
          color={currentTheme === "light" ? "#1890ff" : "#2caad9"}
          size={18}
          padding={"5px"}
        />
      )}
    </div>
  );

  return (
    <div id="lotero-account" className={`section ${!signedIn && !DEBUG ? "not-signed-in" : ""}`}>
      {(signedIn || DEBUG) && display}
      {web3Modal && (
        <Button
          style={{ marginLeft: 8 }}
          shape="round"
          size={accountButtonInfo.size}
          onClick={accountButtonInfo.action}
        >
          {accountButtonInfo.name}
        </Button>
      )}
    </div>
  );
}
