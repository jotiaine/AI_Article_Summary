import React, { useState } from "react";
import { linkIcon } from "../assets";

const SearchForm = ({ onSubmit }) => {
  const [articleUrl, setArticleUrl] = useState("");
  const [summaryLength, setSummaryLength] = useState("short");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ length: summaryLength, articleUrl: articleUrl });
  };

  return (
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
      <div className="relative">
        <img
          src={linkIcon}
          alt="link-icon"
          className="absolute left-0 my-2 ml-3 w-5"
        />
        <input
          type="url"
          placeholder="Paste the article link"
          value={articleUrl}
          onChange={(e) => setArticleUrl(e.target.value)}
          required
          className="url_input peer"
        />
        <button
          type="submit"
          className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 "
        >
          <p>↵</p>
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
