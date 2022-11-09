import { useState } from "react";

export default function Countdown(props) {
  const [expired, setExpired] = useState(false);
  const date = new Date();
  return (
    <div>
      {expired ? (
        <p>Today's bet already closed.</p>
      ) : (
        <>
          <p>Today's bet closes in:</p>
          {/* <DateCountdown dateTo={date.toUTCString()} callback={() => setExpired(true)} /> */}
        </>
      )}
    </div>
  );
}
