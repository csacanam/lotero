import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"

// displays a page header

export default function Header({ title, subtitle }) {
  return (
    <div id="lotero-header">
      <Link to="/">
        <h1 id="lotero-header--title">
          {title}
        </h1>
      </Link>
      <h3 id="lotero-header--subtitle">
        {subtitle}
      </h3>
    </div>
  );
}

Header.defaultProps = {
  title: "Lotero",
  subtitle: "Safe and fair lottery game with high chances of winning!",
};
