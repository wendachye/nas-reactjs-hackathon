import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState("");
  const [story, setStory] = useState("topstories");
  const [stories, setStories] = useState([]);

  const fetchItem = async (itemId) => {
    try {
      let response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`
      );

      let data = await response.json();

      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const pageLimit = process.env.REACT_APP_PAGE_LIMIT
      ? process.env.REACT_APP_PAGE_LIMIT
      : 50;

    const fetchStories = async (type) => {
      try {
        let response = await fetch(
          `https://hacker-news.firebaseio.com/v0/${type}.json?print=pretty`
        );

        let data = await response.json();
        data = data.slice(0, pageLimit);

        let stories = [];

        for (const item of data) {
          let story = fetchItem(item);

          stories = [...stories, story];
        }

        setStories(stories);
      } catch (error) {
        console.log(error);
      }
    };

    // fetchStories(story);

    setActiveNavItem(window.location.pathname);
  }, [story]);

  const onClickToggleNav = () => {
    setNavCollapsed(!navCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
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
      {stories.map((story) => {
        console.log(story);
      })}
      {/* <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div> */}
    </nav>
  );
}

export default App;
