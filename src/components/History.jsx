import React from "react";
import { copy, tick } from "../assets";

function History({ allArticles, setArticle, handleCopy, copied }) {
  return (
    <div className="my-0 max-w-full flex justify-center items-center">
      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
        {allArticles.reverse().map((item, index) => (
          <div
            key={`link-${index}`}
            onClick={() => setArticle(item)}
            className="link_card"
          >
            <div className="copy_btn" onClick={() => handleCopy(item.url)}>
              <img
                src={copied === item.url ? tick : copy}
                alt={copied === item.url ? "tick_icon" : "copy_icon"}
                className="w-[40%] h-[40%] object-contain"
              />
            </div>
            <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
              {item.url}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
