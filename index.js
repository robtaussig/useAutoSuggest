import React, { useState, useEffect, useRef } from 'react';
import AutoSuggest from './autosuggest';

export const useAutoSuggest = (inputValue, historicalEntries, limit) => {
  const [suggestionList, setSuggestionList] = useState([]);
  const autoSuggest = useRef(null);

  const getAutoSuggest = () => {
    if (autoSuggest.current === null) {
      autoSuggest.current = new AutoSuggest();
    }
    return autoSuggest.current;
  };

  useEffect(() => {
    getAutoSuggest().process(historicalEntries);
  }, [historicalEntries]);

  useEffect(() => {
    const nextSuggestionList = getAutoSuggest().generateSuggestions(inputValue)

    setSuggestionList(limit ? nextSuggestionList.slice(0, limit) : nextSuggestionList);
  }, [inputValue, limit]);

  return suggestionList;
};
