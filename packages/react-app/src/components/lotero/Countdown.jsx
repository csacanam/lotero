import { CountDownHourly } from "@nilevia/count-down-timer-react";
import "@nilevia/count-down-timer-react/dist/index.css";
import { useState } from "react";
import "./Countdown.css";

export default function Countdown() {
  const [expired, setExpired] = useState(false);
  const date = new Date("Mon, 15 Nov 2022 23:57:14 GMT");
  return (
    <div id="lotero-counter">
      {expired ? (
        <p>Today's bet already closed.</p>
      ) : (
        <>
          <p>Today's bet closes in <CountDownHourly endDate={date.toUTCString()} onFinish={() => setExpired(true)} /></p>
        </>
      )}
    </div>
  );
}
