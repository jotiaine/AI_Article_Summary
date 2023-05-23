import React, { useState } from "react";
import { linkIcon } from "../assets";

const SearchForm = ({ onSubmit, onClearList }) => {
  const [articleUrl, setArticleUrl] = useState("");
  const [summaryLength, setSummaryLength] = useState("short");

  const handleClearList = () => {
    // Handle clearing the list
    onClearList();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ length: summaryLength, articleUrl: articleUrl });
    // clear the input field
    setArticleUrl("");
  };

  return (
    <div className="mb-0">
      <form
        className="relative flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="mb-2">
          <select
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value)}
            className="summary_length_select peer"
            required
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
        <div className="relative flex items-center">
          <img
            src={linkIcon}
            alt="link-icon"
            className="absolute left-0 ml-3 w-5 "
          />
          <input
            type="url"
            placeholder="Paste the article link"
            value={articleUrl}
            onChange={(e) => setArticleUrl(e.target.value)}
            required
            className="url_input peer block"
          />
          <button
            type="submit"
            className=" submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 "
          >
            <p>↵</p>
          </button>
        </div>
      </form>
      <div className="my-10 mb-0">
        <button
          className="shadow p-2 ms-3 peer-focus:border-gray-700 peer-focus:text-gray-700"
          onClick={handleClearList}
        >
          Clear List
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
