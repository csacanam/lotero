import { useEffect, useState } from "react";
import { Balance } from "../components";

export default function Home({ contract, provider, price }) {
  const [totalMoneyInBet, setTotalMoneyInBet] = useState(undefined);
  const [activeBet, setActiveBet] = useState(undefined);
  const [moneyInContract, setMoneyInContract] = useState(undefined);

  useEffect(async () => {
    if (contract) {
      const betId = await contract.activeBet();
      setActiveBet(betId);
      setTotalMoneyInBet(await contract.getTotalMoneyInBet(betId));
      setMoneyInContract(await contract.getMoneyInContract());
    }
  }, [contract, !activeBet, !totalMoneyInBet, !moneyInContract]);

  return (
    <div>
      <p>
        Lotero.co es una aplicación descentralizada (DApp) que le permite a las personas apostar sus
        criptomonedas y multiplicarlas por 5 con una probabilidad del 10%.
      </p>
      <ul>
        <li>Active bet: {activeBet ? activeBet.toNumber() : ""}</li>
        <li>
          Amount of money in active bet: {" "}
          <Balance
            balance={totalMoneyInBet}
            provider={provider}
            price={price}
          />
        </li>
        <li>Money in contract: {" "}
          <Balance
            balance={moneyInContract}
            provider={provider}
            price={price}
          />
        </li>
      </ul>
    </div>
  );
}
