import { Button, Input, notification, Select } from "antd";
import { useBalance } from "eth-hooks";
import { utils } from "ethers";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { getRPCPollTime } from "../../helpers";
import Balance from "../Balance";
import InfoPanel from "./InfoPanel";
import "./Bet.css";

const { Option } = Select;
const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 80,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "8px",
  height: "8px",
  perspective: "500px",
};

/**
 * Renders the bet component.
 * @param contract Lotero's contract
 * @param address The user's wallet address
 * @returns A valid react child
 */
export default function Bet({ contract, address, provider, price, tx, activeBet }) {
  const [number, setNumber] = useState(0);
  const [betVal, setBetVal] = useState("0");
  const [bet, setBet] = useState(0);
  const [dollars, setDollars] = useState(0);
  const [factor, setFactor] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableQuotaInBet, setAvailableQuotaInBet] = useState(0);

  let localProviderPollingTime = getRPCPollTime(provider);
  const balance = useBalance(provider, address, localProviderPollingTime);
  let floatBalance = parseFloat("0.00");
  let walletBalance = balance;

  if (walletBalance) {
    const etherBalance = utils.formatEther(walletBalance);
    parseFloat(etherBalance);
    floatBalance = parseFloat(etherBalance);
  }

  useEffect(async () => {
    if (contract) {
      setFactor(await contract.MAX_WIN_MULTIPLIER());
      setAvailableQuotaInBet(await contract.getAvailableQuotaInBet(activeBet));
    }
  }, [contract, !factor]);

  if (!address) {
    return <div id="lotero-bet" className="not-signed-in"></div>;
  }

  const toDollars = val => parseFloat(val * price).toFixed(2);
  const valid = typeof bet === "number" && bet > 0 && bet <= floatBalance;
  const data = [
    {
      label: "MATIC price",
      value: `\$${price} USD`,
    },
    {
      label: "Bet amount",
      value: `\$${toDollars(bet * 0.95)} USD`,
    },
    {
      label: "Comission fee (5%)",
      value: `\$${toDollars(bet * 0.05)} USD`,
    },
    // {
    //   label: "GAS price",
    //   value: "known during transaction"
    // },
    // {
    //   label: "Gain factor",
    //   value: `${factor}`
    // }
  ];
  const onSubmit = async () => {
    if (bet <= floatBalance) {
      console.log("Available --->>>>>>>> ", availableQuotaInBet[number].toNumber());
      if (bet <= availableQuotaInBet[number].toNumber()) {
        setIsSubmitting(true);
        await tx(
          contract.bet(activeBet, number, address, { value: utils.parseEther(betVal) }),
          result => {
            setIsSubmitting(false);
            if (!result.error) {
              setIsSubmitted(true);
              notification.success({
                message: "New bet",
                description: "Congratulations! your bet has been received!",
                placement: "bottomRight",
              });
              setBet(0);
              setBetVal("0");
              setTimeout(() => setIsSubmitted(false), 1000);
            }
          },
        );
      } else {
        notification.error({
          message: "New bet",
          description: `The available quota for the number you selected is ${availableQuotaInBet}. Lower the bet amount to participate.`,
          placement: "bottomRight",
        });
      }
    } else {
      notification.error({
        message: "New bet",
        description: `Insufficient funds to place the bet. Your current balance is ${floatBalance}`,
        placement: "bottomRight",
      });
    }
  };

  let buttonLabel = "Place your bet";
  if (isSubmitting) {
    buttonLabel = "Submitting...";
  } else if (valid) {
    buttonLabel = `Bet ${bet} MATIC`;
  } else if (bet > floatBalance) {
    buttonLabel = "Insufficient funds";
  }

  return (
    <div id="lotero-bet">
      <form>
        <fieldset>
          <span
            id="lotero-bet--bet"
            aria-label="Bet amount"
            // aria-describedby={bet > 0 ? `You are betting \$${dollars} USD on number ${number}` : ""}
          >
            <Input
              name="bet"
              suffix="MATIC"
              size="large"
              value={betVal}
              type="number"
              onChange={e => {
                setBetVal(e.target.value);
                const value = parseFloat(e.target.value);
                setBet(value ? value : 0);
                setDollars(toDollars(value));
              }}
              min={0}
              max={Math.min(50, floatBalance)}
            />
          </span>
          <span aria-label="Number" id="lotero-bet--number">
            <Select
              name="number"
              defaultValue={number}
              size="large"
              style={{ width: 75 }}
              onChange={value => setNumber(parseInt(value))}
            >
              <Option value="0">0</Option>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
              <Option value="6">6</Option>
              <Option value="7">7</Option>
              <Option value="8">8</Option>
              <Option value="9">9</Option>
            </Select>
          </span>
        </fieldset>
        {bet > 0 && (
          <fieldset>
            <div id="lotero-bet--potential-gain" aria-describedby="Your potential gains">
              <h3>
                <Balance
                  balance={utils.parseEther(`${bet * 0.95 * factor}`)}
                  provider={provider}
                  price={price}
                />
              </h3>
            </div>
          </fieldset>
        )}
        {bet > 0 && (
          <fieldset>
            <InfoPanel data={data} />
          </fieldset>
        )}
        <fieldset>
          <Button
            style={{ width: "100%" }}
            type="primary"
            size="large"
            disabled={!valid}
            onClick={onSubmit}
          >
            {buttonLabel}
            <Confetti active={isSubmitted} config={confettiConfig} />
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
