import { memo } from "react";
import "./News.css";

function News({ item, itemNo }) {
  // const onClickUser = () => {
  //   window.location.pathname = `/user?${item.by}`;
  // };

  return (
    <div className="row news-content">
      <div className="col">
        <div className="row news-title">
          <div className="col">
            {`${itemNo}. `}
            <a className="news-url" href={item.url}>{`${item.title}`}</a>
          </div>
        </div>
        <div className="row news-metadata">
          <div className="col">
            {`${item.score} points by`}
            <a
              className="news-metadata-link"
              href={`/user?id=${item.by}`}
              // onClick={onClickUser}
            >{` ${item.by} `}</a>
            <a
              className="news-metadata-link"
              href="/#"
            >{` ${item.formattedTime} `}</a>
            {`| hide |`}
            <a
              className="news-metadata-link"
              href="/#"
            >{` ${item.descendants} comments`}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(News);
