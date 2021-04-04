import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Spinner from "./components/Spinner/Spinner";
import News from "./components/News/News";
import timeAgoUtil from "./utils/timeAgoUtil.js";
import "./App.css";

function App() {
  const [activeNavItem, setActiveNavItem] = useState("");
  const [story, setStory] = useState("topstories");
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    const pageLimit = process.env.REACT_APP_PAGE_LIMIT
      ? process.env.REACT_APP_PAGE_LIMIT
      : 30;

    const fetchStories = async (type) => {
      try {
        let response = await fetch(
          `https://hacker-news.firebaseio.com/v0/${type}.json?print=pretty`
        );

        let data = await response.json();
        data = data.slice(0, pageLimit);

        let stories = [];

        for (const item of data) {
          let story = await fetchItem(item);
          story.formattedTime = timeAgoUtil(new Date(story.time * 1000));

          stories = [...stories, story];
        }

        console.log(stories);

        setStories(stories);
      } catch (error) {
        console.log(error);
      }
    };

    setActiveNavItem(window.location.pathname);

    fetchStories(story);
  }, [story]);

  return (
    <>
      <Navbar activeNavItem={activeNavItem} />
      <div>
        {stories.length > 0 ? (
          <div>
            {stories.map((item, key) => (
              <News key={key} itemNo={key} item={item} />
            ))}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
}

export default App;
