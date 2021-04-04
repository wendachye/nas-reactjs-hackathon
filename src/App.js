import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./components/Navbar/Navbar";
import Spinner from "./components/Spinner/Spinner";
import News from "./components/News/News";
import Pagination from "./components/Pagination/Pagination";
import timeAgoUtil from "./utils/timeAgoUtil.js";
import "./App.css";

function App() {
  const pageLimit = process.env.REACT_APP_PAGE_LIMIT
    ? parseInt(process.env.REACT_APP_PAGE_LIMIT, 0)
    : 30;
  const [activeNavItem, setActiveNavItem] = useState("");
  const [storyType, setStoryType] = useState("topstories");
  const [totalStories, setTotalStories] = useState([]);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationStart, setPaginationStart] = useState(0);
  const [paginationEnd, setPaginationEnd] = useState(pageLimit);

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

  useEffect(() => {
    setActiveNavItem(window.location.pathname);

    if (window.location.pathname === "/new") {
      setStoryType("newstories");
    } else {
      setStoryType("topstories");
    }

    if (window.location.search) {
      let query = window.location.search.substring(1);
      let queries = query.split("&");
      for (const item of queries) {
        let pair = item.split("=");

        if (pair[0].toLowerCase() === "page") {
          let page = parseInt(pair[1], 0);

          if (page > 0) {
            let paginationStart = (page - 1) * pageLimit;
            let paginationEnd =
              paginationStart + pageLimit < totalStories.length
                ? paginationStart + pageLimit
                : 500;

            setCurrentPage(page);
            setPaginationStart(paginationStart);
            setPaginationEnd(paginationEnd);
          }
          break;
        }
      }
    }

    const fetchStories = async () => {
      try {
        setIsLoading(true);

        let response = await fetch(
          `https://hacker-news.firebaseio.com/v0/${storyType}.json?print=pretty`
        );

        let data = await response.json();
        setTotalStories(data);

        data = data.slice(paginationStart, paginationEnd);

        let stories = [];

        for (const item of data) {
          let story = await fetchItem(item);
          story.formattedTime = timeAgoUtil(new Date(story.time * 1000));

          stories = [...stories, story];
        }

        setStories(stories);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [
    storyType,
    paginationStart,
    paginationEnd,
    pageLimit,
    totalStories.length,
  ]);

  const onPageChanged = useCallback(
    (data) => {
      const { newCurrentPage } = data;

      let paginationStart = (newCurrentPage - 1) * pageLimit;
      let paginationEnd =
        paginationStart + pageLimit < totalStories.length
          ? paginationStart + pageLimit
          : 500;

      console.log(newCurrentPage);

      setCurrentPage(newCurrentPage);
      setPaginationStart(paginationStart);
      setPaginationEnd(paginationEnd);
    },
    [pageLimit, totalStories.length]
  );

  return (
    <>
      <Navbar activeNavItem={activeNavItem} />
      <div className="content">
        {!isLoading ? (
          <div>
            {stories.map((item, key) => {
              let itemNo = paginationStart + key + 1;

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
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
}

export default App;
