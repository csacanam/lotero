import { Divider, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import Bet from "../components/lotero/Bet";
import Countdown from "../components/lotero/Countdown";
import InfoPanel from "../components/lotero/InfoPanel";

export default function Lotero({ contract }) {
  const [activeBet, setActiveBet] = useState(undefined);
  const [totalBets, setTotalBets] = useState(undefined);

  useEffect(async () => {
    setActiveBet(await contract.activeBet());
    setTotalBets(await contract.totalBets());
  }, [contract, !activeBet, !totalBets]);

  if (!contract) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  return (
    <div style={{ width: 300, margin: "auto" }}>
      <Space direction="vertical" size="small" style={{ display: "flex" }}>
        <Countdown />
        <Divider />
        <Bet contract={contract} />
        <Divider />
        <InfoPanel activeBet={activeBet} totalBets={totalBets} />
      </Space>
    </div>
  );
}
