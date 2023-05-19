import React, { useState, useRef } from "react";
import { loader } from "../assets";

function Summaries({ isFetching, error, article = {}, handleClick, speech }) {
  const summary = article.summary;
  const [rate, setRate] = useState(1);
  const rateRef = useRef(null);

  const handleRateChange = (event) => {
    const newRate = parseFloat(event.target.value);
    setRate(newRate);

    if (speech.isSpeaking) {
      speech.synthesis.cancel();
      handleClick(summary, newRate);
    }
  };

  return (
    <div className="my-10 max-w-full flex justify-center items-center">
      {isFetching ? (
        <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
      ) : error ? (
        <p className="font-inter font-bold text-black text-center">
          Well, that wasn't supposed to happen...
          <br />
          <span className="font-satoshi font-normal text-gray-700">
            {error?.data?.error}
          </span>
        </p>
      ) : summary ? (
        <div className="flex flex-col gap-3">
          <h2 className="font-satoshi font-bold text-gray-600 text-xl">
            Article <span className="blue_gradient">Summary</span>
          </h2>
          <div className="summary_box flex flex-col gap-2">
            <button onClick={() => handleClick(summary, rate)}>
              {speech.isSpeaking ? "Stop" : "Play"}
            </button>
            <div id="rate-control">
              <label htmlFor="rate">Rate:</label>
              <input
                type="range"
                min="0.5"
                max="2"
                value={rate}
                step="0.1"
                id="rate"
                ref={rateRef}
                onChange={handleRateChange}
              />
            </div>
            <p className="font-inter font-medium text-sm text-gray-700">
              {summary}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Summaries;
