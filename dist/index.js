"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const autosuggest_1 = require("./lib/autosuggest");
exports.useAutoSuggest = (inputValue, historicalEntries, limit) => {
    const [suggestionList, setSuggestionList] = react_1.useState([]);
    const autoSuggest = react_1.useRef(null);
    const getAutoSuggest = () => {
        if (autoSuggest.current === null) {
            autoSuggest.current = new autosuggest_1.default();
        }
        return autoSuggest.current;
    };
    react_1.useEffect(() => {
        getAutoSuggest().process(historicalEntries);
    }, [historicalEntries]);
    react_1.useEffect(() => {
        const nextSuggestionList = getAutoSuggest().generateSuggestions(inputValue);
        setSuggestionList(limit ? nextSuggestionList.slice(0, limit) : nextSuggestionList);
    }, [inputValue, limit]);
    return suggestionList;
};
exports.default = exports.useAutoSuggest;
//# sourceMappingURL=index.js.map