import "./News.css";

function News({ item, itemNo }) {
  return (
    <div className="row news-content">
      <div className="col-1">{`${itemNo + 1}.`}</div>
      <div className="col-11">
        <div className="row news-title">
          <div className="col">{item.title}</div>
        </div>
        <div className="row news-metadata">
          <div className="col">{`${item.score} by ${item.by} ${
            item.formattedTime
          } | hide | ${
            item?.kids?.length ? item.kids.length + " comments" : ""
          }`}</div>
          {/* <div className="col-2">{`by ${item.by}`}</div>
          <div className="col-3">{item.time}</div>
          <div className="col-3">{`| hide |`}</div>
          <div className="col-3">{`| hide |`}</div> */}
        </div>
      </div>
    </div>
  );
}

export default News;
