"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.useAutoSuggest = void 0;

var _react = _interopRequireWildcard(require("react"));

var _autosuggest = _interopRequireDefault(require("./lib/autosuggest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useAutoSuggest = function useAutoSuggest(inputValue, historicalEntries, limit) {
  var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      suggestionList = _useState2[0],
      setSuggestionList = _useState2[1];

  var autoSuggest = (0, _react.useRef)(null);

  var getAutoSuggest = function getAutoSuggest() {
    if (autoSuggest.current === null) {
      autoSuggest.current = new _autosuggest["default"]();
    }

    return autoSuggest.current;
  };

  (0, _react.useEffect)(function () {
    getAutoSuggest().process(historicalEntries);
  }, [historicalEntries]);
  (0, _react.useEffect)(function () {
    var nextSuggestionList = getAutoSuggest().generateSuggestions(inputValue);
    setSuggestionList(limit ? nextSuggestionList.slice(0, limit) : nextSuggestionList);
  }, [inputValue, limit]);
  return suggestionList;
};

exports.useAutoSuggest = useAutoSuggest;
var _default = useAutoSuggest;
exports["default"] = _default;