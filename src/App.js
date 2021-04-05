import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./components/Navbar/Navbar";
import Spinner from "./components/Spinner/Spinner";
import News from "./components/News/News";
import User from "./components/User/User";
import Pagination from "./components/Pagination/Pagination";
import timeAgoUtil from "./utils/timeAgoUtil.js";
import "./App.css";

function App() {
  const pageLimit = process.env.REACT_APP_PAGE_LIMIT
    ? parseInt(process.env.REACT_APP_PAGE_LIMIT, 0)
    : 30;
  const TOP_STORIES = "topstories";
  const NEW_STORIES = "newstories";
  const ASK_STORIES = "askstories";
  const SHOW_STORIES = "showstories";
  const JOB_STORIES = "jobstories";

  const [activeNavItem, setActiveNavItem] = useState("");
  const [totalStories, setTotalStories] = useState([]);
  const [stories, setStories] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchItem = async (itemId) => {
    try {
      let response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`
      );

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalStories = async (storyType) => {
    try {
      let response = await fetch(
        `https://hacker-news.firebaseio.com/v0/${storyType}.json?print=pretty`
      );

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async (id) => {
    try {
      let response = await fetch(
        `https://hacker-news.firebaseio.com/v0/user/${id}.json?print=pretty`
      );

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchStories = async (storyType, currentPage) => {
      try {
        setIsLoading(true);

        let newTotalStories = await fetchTotalStories(storyType);

        setTotalStories(newTotalStories);

        let paginationStart = 0;
        let paginationEnd = pageLimit;

        paginationStart = (currentPage - 1) * pageLimit;
        paginationEnd =
          paginationStart + pageLimit < newTotalStories.length
            ? paginationStart + pageLimit
            : newTotalStories.length;

        let data = newTotalStories.slice(paginationStart, paginationEnd);

        let stories = [];
        let cocurrentCall = await data.map((item) => {
          return fetchItem(item);
        });

        console.log("cocurrentCall", cocurrentCall);

        let results = await Promise.all(cocurrentCall);

        console.log("results", results);

        for (const story of results) {
          story.itemNo = paginationStart;
          if (story.time) {
            story.formattedTime = timeAgoUtil(new Date(story.time * 1000));
          }
          stories = [...stories, story];
        }

        console.log("stories", stories);

        setStories(stories);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserProfile = async (id) => {
      try {
        let data = await fetchUser(id);

        setUser(data);
        setIsLoading(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    let id = null;

    if (window.location.pathname === "/user") {
      if (window.location.search) {
        let query = window.location.search.substring(1);
        let queries = query.split("&");
        for (const item of queries) {
          let pair = item.split("=");

          if (pair[0].toLowerCase() === "id") {
            id = pair[1];
            break;
          }
        }
      }

      if (id) {
        fetchUserProfile(id);
      }
    } else {
      setActiveNavItem(window.location.pathname);

      let storyType = TOP_STORIES;

      if (window.location.pathname === "/new") {
        storyType = NEW_STORIES;
      }

      if (window.location.pathname === "/ask") {
        storyType = ASK_STORIES;
      }

      if (window.location.pathname === "/show") {
        storyType = SHOW_STORIES;
      }

      if (window.location.pathname === "/jobs") {
        storyType = JOB_STORIES;
      }

      let newCurrentPage = 1;

      if (window.location.search) {
        let query = window.location.search.substring(1);
        let queries = query.split("&");
        for (const item of queries) {
          let pair = item.split("=");

          if (pair[0].toLowerCase() === "page") {
            let page = parseInt(pair[1], 0);

            if (page > 0) {
              newCurrentPage = page;

              setCurrentPage(newCurrentPage);
            }
            break;
          }
        }
      }

      fetchStories(storyType, newCurrentPage);
    }
  }, [pageLimit]);

  const onPageChanged = useCallback((data) => {
    const { newCurrentPage } = data;

    setCurrentPage(newCurrentPage);
  }, []);

  return (
    <>
      <Navbar activeNavItem={activeNavItem} />
      <div className="content">
        {!isLoading ? (
          <div>
            {window.location.pathname === "/user" ? (
              <User user={user} />
            ) : (
              <div>
                {stories.map((item, key) => {
                  let itemNo = item.itemNo + key + 1;

                  return <News key={key} itemNo={itemNo} item={item} />;
                })}
                <Pagination
                  currentPage={currentPage}
                  totalRecords={totalStories.length}
                  pageLimit={pageLimit}
                  pageNeighbours={2}
                  onPageChanged={onPageChanged}
                />
              </div>
            )}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
}

export default App;
