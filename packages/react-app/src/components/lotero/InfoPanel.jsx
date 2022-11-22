import "./InfoPanel.css";

export default function InfoPanel({ data }) {
  return (
    <div id="lotero-info-panel">
      <ul>
        {data &&
          data.length > 0 &&
          data.map(item => (
            <li key={item.label}>
              <span>{item.label}</span>
              <span>{item.value}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
