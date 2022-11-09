import { Button } from "antd";
import { tryToDisplay } from "../Contract/utils";

export default function InfoPanel({ activeBet, totalBets }) {
  const previous = {
    number: 5,
    date: new Date(),
    reward: 50,
  };
  const current = {
    bet: 5,
  };
  return (
    <div>
      <h3>
        Last winner number: {previous.number} ({previous.date.toUTCString()})
      </h3>
      <h3>Reward: {previous.reward} MATIC</h3>
      <h3>Bets: {tryToDisplay(totalBets, true)}</h3>
      <h3>Current bet: {tryToDisplay(activeBet, true)} MATIC</h3>
      <Button>Withdraw reward</Button>
    </div>
  );
}
