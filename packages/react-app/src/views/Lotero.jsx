import { Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { LoteroWrapper, Bet } from "../components";
import "./Lotero.css";

export default function Lotero({ provider, price, contract, address, children }) {
  const [activeBet, setActiveBet] = useState(undefined);

  useEffect(async () => {
    if (contract) {
      setActiveBet((await contract.activeBet()).toNumber());
    }
  }, [contract, !activeBet]);

  if (!contract) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  return (
    <div id="lotero">
      <LoteroWrapper activeBet={activeBet}>
        {children}
        <Bet contract={contract} address={address} provider={provider} price={price} />
      </LoteroWrapper>
    </div>
  );
}
