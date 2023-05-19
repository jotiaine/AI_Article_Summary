import "./App.css";

import { useLazyGetSummaryQuery } from "./services/article";
import React, { useState, useEffect } from "react";
import Hero from "./components/Hero";
import SearchForm from "./components/SearchForm";
import History from "./components/History";
import Summaries from "./components/Summaries";

const App = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [speech, setSpeech] = useState(null);

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech");
      return;
    }

    const synthesis = window.speechSynthesis;
    const defaultVoice = synthesis
      .getVoices()
      .find((voice) => voice.lang === "en-US");

    setSpeech({
      synthesis,
      defaultVoice,
      text: "",
      isSpeaking: false,
    });
  }, []);

  const handleClick = (text, rate) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speech.defaultVoice;

    utterance.rate = rate;

    if (speech.isSpeaking) {
      speechSynthesis.cancel();
      setSpeech({
        ...speech,
        isSpeaking: false,
      });
    } else {
      utterance.onstart = () => {
        setSpeech({
          ...speech,
          isSpeaking: true,
        });
      };

      speechSynthesis.speak(utterance);
      setSpeech({
        ...speech,
        isSpeaking: true,
        text: text,
      });

      utterance.onend = () => {
        setSpeech({
          ...speech,
          isSpeaking: false,
        });
        rateInput.removeEventListener("input");
      };
    }

    const rateInput = document.getElementById("rate");
    rateInput.addEventListener("input", () => {
      utterance.rate = rateInput.value;
      speechSynthesis.speak(utterance);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const lengths = [1, 3, 6]; // the desired summary lengths
    const summaries = [];
    for (const length of lengths) {
      const { data } = await getSummary({ articleUrl: article.url, length });
      if (data && data.summary) {
        summaries.push(data.summary);
      } else {
        summaries.push("");
      }
    }

    const newArticle = { ...article, summaries };
    const updatedAllArticles = [newArticle, ...allArticles];

    // update state and local storage
    setArticle(newArticle);
    setAllArticles(updatedAllArticles);
    localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
  };

  // copy the url and toggle the icon for user feedback
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (
    <main>
      {/* <div className="main">
        <div className="gradient" />
      </div> */}

      <div className="app">
        <Hero />
        <section className="mt-16 w-full max-w-xl">
          <div className="flex flex-col w-full gap-2">
            {/* Search */}
            <SearchForm onSubmit={handleSubmit} />

            {/* History */}
            <History
              allArticles={allArticles}
              setArticle={setArticle}
              handleCopy={handleCopy}
              copied={copied}
            />
          </div>

          {/* Summaries */}
          <Summaries
            isFetching={isFetching}
            error={error}
            article={article}
            handleClick={handleClick}
            speech={speech}
          />
        </section>
      </div>
    </main>
  );
};

export default App;
