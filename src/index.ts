import { useState, useEffect, useRef } from 'react';
import AutoSuggest from './lib/autosuggest';

export const useAutoSuggest = (
  inputValue: string,
  historicalEntries: string[],
  limit?: number,
  trieDepth?: number,
): string[] => {
  const [suggestionList, setSuggestionList] = useState([]);
  const autoSuggest = useRef(null);

  const getAutoSuggest = () => {
    if (autoSuggest.current === null) {
      autoSuggest.current = new AutoSuggest(trieDepth);
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

export default useAutoSuggest;
