import React, { useEffect, useRef, useState } from "react";
import Pulse from "../Loader/Pulse";

const HighLightText = ({ text, query, customClass }) => {
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span>
      {" "}
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part.toLowerCase() === query.toLowerCase() ? `${customClass}` : ""
          }
        >
          {part.toUpperCase()}
        </span>
      ))}{" "}
    </span>
  );
};

function StockSuggestion({
  search,
  loading,
  history,
  suggestions,
  ClearSearchBox,
  handleSelect,
}) {
  function OpenSymbol(symbol) {
    handleSelect(symbol);
    ClearSearchBox();
  }

  if (suggestions === undefined) {
    suggestions = [];
  }
  // console.log(suggestions, loading, search);

  if (loading) {
    return (
      <div className="search__loader">
        <Pulse />
        <p>Loading Stocks Please Wait ...</p>
      </div>
    );
  }

  if (Array.isArray(suggestions) && suggestions.length > 0) {
    return (
      <>
        {suggestions.map((s, i) => {
          return (
            <p
              key={`${s.symbol}=${s.code}`}
              onClick={() => {
                OpenSymbol(s.symbol);
              }}
            >
              <span>{s.symbol}</span>
              <HighLightText
                text={s.company}
                query={search}
                customClass="search__highlight"
              />
              <span>{s.exchange.exchange}</span>
            </p>
          );
        })}
      </>
    );
  } else {
    return (
      <div className="search__loader">
        {search.length === 0 ? (
          <>
            <Pulse />
            <p>No recent searches</p>
            <p>Hit Me...</p>
          </>
        ) : (
          <p>
            No result for &nbsp;<strong>'{search.toUpperCase()}'</strong>
          </p>
        )}
      </div>
    );
  }
}

const StockSearch = ({ handleSelect }) => {
  const ref = useRef(null);
  const abortControllerRef = useRef(null);

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestion] = useState(undefined);

  // const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;
  const REQUEST_BASE_URL = "https://www.swiftfolios.com/api/v1";

  https: useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    search.length === 0 ? setSuggestionOpen(false) : setSuggestionOpen(true);

    async function GetStockSuggestions() {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      if (search === "") {
        // setLoading(false);
        return [];
      }

      const response = await fetch(
        `${REQUEST_BASE_URL}/stock/${search}/stocks`,
        { signal }
      );

      const data = await response.json();
      //   setLoading(false);

      return data.suggestions;
    }

    const triggerAPICall = setTimeout(async () => {
      const data = await GetStockSuggestions();
      setSuggestion(data);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(triggerAPICall);
      setSuggestion(undefined);
    };
  }, [search]);

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setSuggestionOpen(false);
      setSearch("");
      setSuggestion(undefined);
    }
  }

  function ClearSearchBox() {
    setSearch("");
    setSuggestion([]);
    setSuggestionOpen(false);
  }

  return (
    <div className="stock__search__icons__wrapper">
      <div className="stock__search" ref={ref}>
        {/* <div className="stock__search__icon">
          <img src={Search} alt="" />
        </div> */}
        <input
          placeholder="Search Stock"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          //   onClick={() => {
          //     search.length === 0
          //       ? setSuggestionOpen(false)
          //       : setSuggestionOpen(true);
          //     // setSuggestionOpen(true);
          //   }}
        />

        {suggestionOpen && (
          <>
            <div className="stock__suggestions">
              {/* <SearchTabs tab={searchTab} changeActiveTab={setSearchTab} /> */}
              <div className="suggestion__stocks">
                <StockSuggestion
                  search={search}
                  loading={loading}
                  handleSelect={handleSelect}
                  //   history={history}
                  suggestions={suggestions}
                  ClearSearchBox={ClearSearchBox}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StockSearch;
