import "./DebugSection.css";

export default function DebugSection({ display, children }) {
  if (!display) {
    return null;
  }

  return <section className="debug-section">{children}</section>;
}
