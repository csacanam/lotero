import Countdown from "./Countdown";
import "./LoteroWrapper.css";

export default function LoteroWrapper({ activeBet, children }) {
  return (
    <main id="lotero-wrapper">
      <header>
        <h1>Lotero #{activeBet + 1}</h1>
        <Countdown />
      </header>
      <section>
        {children}
      </section>
    </main>
  );
}
