import React, { useState } from "react";
import "./Navbar.css";

function Navbar({ activeNavItem }) {
  const [navCollapsed, setNavCollapsed] = useState(true);

  const onClickToggleNav = () => {
    setNavCollapsed(!navCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Hacker News
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={onClickToggleNav}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={
            navCollapsed ? `collapse navbar-collapse` : "navbar-collapse"
          }
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className={
                  activeNavItem === "/new" ? `nav-link active` : `nav-link`
                }
                href="/new"
              >
                New
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  activeNavItem === "/past" ? `nav-link active` : `nav-link`
                }
                href="/past"
              >
                Past
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  activeNavItem === "/comments" ? `nav-link active` : `nav-link`
                }
                href="/comments"
              >
                Comments
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  activeNavItem === "/ask" ? `nav-link active` : `nav-link`
                }
                href="/ask"
              >
                Ask
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  activeNavItem === "/show" ? `nav-link active` : `nav-link`
                }
                href="/show"
              >
                Show
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  activeNavItem === "/jobs" ? `nav-link active` : `nav-link`
                }
                href="/jobs"
              >
                Jobs
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
