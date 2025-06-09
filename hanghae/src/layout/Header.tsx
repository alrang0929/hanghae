import { gnbMenu } from "../data/menu.ts";
import "./header.scss";

export const Header = () => {
  const MENU_DATA = gnbMenu;

  return (
    <>
      <nav className="header-wrap">
        <h1> Ji Hyeon Kim / Portfolio 2025</h1>
        <ul className="right-menu">
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
