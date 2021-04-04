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

  const timetoTimeAgo = (timeStamp) => {
    let timeSegments = [
      3.154e10,
      2.628e9,
      6.048e8,
      8.64e7,
      3.6e6,
      60000,
      -Infinity,
    ];

    let makeTimeString = (unit, singularString) => (timeSegment, time) =>
      time >= 2 * timeSegment
        ? `${Math.floor(time / timeSegment)} ${unit}s ago`
        : singularString;

    let timeFunctions = [
      makeTimeString("year", "1 year ago"),
      makeTimeString("month", "1 month ago"),
      makeTimeString("week", "1 week ago"),
      makeTimeString("day", "1 day ago"),
      makeTimeString("hour", "an hour ago"),
      makeTimeString("minute", "a minute ago"),
      (_) => "just now",
    ];

    let timeDifference = Date.now() - timeStamp;
    let index = timeSegments.findIndex((time) => timeDifference >= time);
    let timeAgo = timeFunctions[index](timeSegments[index], timeDifference);
    return timeAgo;
  };

  const fetchItem = async (itemId) => {
    try {
      let response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`
      );

      let data = await response.json();

      data.formattedTime = timeAgoUtil(new Date(data.time * 1000));

      return data;
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
