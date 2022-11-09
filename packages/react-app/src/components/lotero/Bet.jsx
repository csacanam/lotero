import { Button, Input, Select } from "antd";
import { useState } from "react";

const { Option } = Select;

export default function Bet({ contract, address }) {
  const [number, setNumber] = useState(0);
  const [bet, setBet] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const valid = typeof bet === "number" && bet > 0;
  const onSubmit = async () => {
    setIsSubmitting(true);
    // await contract.bet(address, number, bet);
    alert("Congratulations! your bet has been received!");
    setBet(0);
    setIsSubmitting(false);
  };
  return (
    <div>
      <form>
        <fieldset>
          <label for="number">Choose your number:</label>
          <Select
            name="number"
            defaultValue={number}
            size="large"
            style={{ width: 50 }}
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
        </fieldset>
        <fieldset>
          <label for="bet">Your bet:</label>
          <Input
            name="bet"
            suffix="MATIC"
            size="large"
            value={bet}
            onChange={e => {
              const value = parseInt(e.target.value);
              setBet(value ? value : 0);
            }}
          />
        </fieldset>
        <Button type="submit" disabled={!valid} onClick={onSubmit}>
          {isSubmitting ? "Submitting..." : valid ? `Bet ${bet} MATIC` : "Place your bet"}
        </Button>
      </form>
      <ul>
        <li>Bet time: 8:00 a.m. - 8:00 p.m. (UTC).</li>
        <li>Winner number will be known at 10:00 p.m. (UTC). See winning numbers.</li>
      </ul>
    </div>
  );
}
