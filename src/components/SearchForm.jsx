import React, { useState } from "react";
import { linkIcon } from "../assets";

const SearchForm = ({ onSubmit }) => {
  const [articleUrl, setArticleUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(articleUrl);
  };

  return (
    <form
      className="relative flex justify-center items-center"
      onSubmit={handleSubmit}
    >
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
    </form>
  );
};

export default SearchForm;
