import "./App.css";

import React, { useState, useEffect } from "react";
import { useLazyGetSummaryQuery } from "./services/article";
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
      currentSummary: "",
    });
  }, []);

  const handleClick = (text, rate) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speech.defaultVoice;
    utterance.rate = rate;

    if (speech.isSpeaking) {
      speech.synthesis.cancel();
      setSpeech((prevSpeech) => ({
        ...prevSpeech,
        isSpeaking: false,
      }));
    } else {
      const currentSummary = article.summary;

      utterance.onstart = () => {
        setSpeech((prevSpeech) => ({
          ...prevSpeech,
          isSpeaking: true,
        }));
      };

      speech.synthesis.speak(utterance);
      setSpeech((prevSpeech) => ({
        ...prevSpeech,
        isSpeaking: true,
        text,
        currentSummary,
      }));

      utterance.onend = () => {
        setSpeech((prevSpeech) => ({
          ...prevSpeech,
          isSpeaking: false,
        }));
      };
    }
  };

  const handleSubmit = async (params) => {
    const { length, articleUrl } = params;

    const summaryLength = length === "medium" ? 5 : length === "long" ? 10 : 1;

    try {
      const { data } = await getSummary({
        articleUrl: articleUrl, // Use the correct variable here
        length: summaryLength,
      });

      if (data && data.summary) {
        const { summary } = data;

        // Update the article state with the new article URL and summary
        setArticle({ url: articleUrl, summary });

        // Create a new array of articles with the updated article added to the beginning
        const updatedArticles = [{ url: articleUrl, summary }, ...allArticles];

        // Update the allArticles state with the new array
        setAllArticles(updatedArticles);

        // Save the updated articles array to localStorage
        localStorage.setItem("articles", JSON.stringify(updatedArticles));
      } else {
        // Handle the case when the response data or summary is undefined
        console.error("Invalid response data:", data);
      }
    } catch (error) {
      // Handle any other errors that occur during the API call
      console.error("Error:", error);
    }
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

  const handleClearList = () => {
    // if articles is empty, return
    if (allArticles.length === 0) return;

    setAllArticles([]); // Clear the list by setting it to an empty array
    localStorage.removeItem("articles"); // Remove the articles from localStorage
    // load the page
    window.location.reload();
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
            <SearchForm onSubmit={handleSubmit} onClearList={handleClearList} />

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
