import React from "react";
import { gnbMenu } from "../data/menu.ts";
import '../styles/components/header.scss';

export const Header = () => {

  const MENU_DATA = gnbMenu;

  return (
    <>
      <nav className="header-wrap flex-box space-between padding-V-R">
        <ul className="left-menu">
          <li>Ji Hyeon Kim / Portfolio 2025</li>
        </ul>
        <ul className="right-menu flex-box gap-H-R ">
          {MENU_DATA.map((item) => (
            <li key={item.name}>
              <a href={item.url}>{item.name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
