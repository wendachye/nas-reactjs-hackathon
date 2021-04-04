import "./Spinner.css";

function Spinner() {
  return (
    <div className="text-center loading-container">
      <div
        className="spinner-border ms-auto "
        role="status"
        aria-hidden="true"
      ></div>
      <div className="loading-text">
        <strong>Loading...</strong>
      </div>
    </div>
  );
}

export default Spinner;
