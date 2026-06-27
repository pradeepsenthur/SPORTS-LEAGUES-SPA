import { memo } from "react";

function Header() {
  return (
    <header className="header">
      <p className="eyebrow">Home Assignment - FE - Sports Leagues</p>
      <h1>Sports Leagues Explorer</h1>
      <p className="subtitle">
        Browse all leagues, filter by sport, and open any league to view a
        season badge.
      </p>
    </header>
  );
}

export default memo(Header);
