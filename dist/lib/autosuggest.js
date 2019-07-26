"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _markovchain = _interopRequireDefault(require("./markovchain"));

var _trie = _interopRequireDefault(require("./trie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var formatWord = function formatWord(word) {
  return word.trim().toLowerCase();
};

var AutoSuggest =
/*#__PURE__*/
function () {
  function AutoSuggest() {
    _classCallCheck(this, AutoSuggest);

    this.visited = {};
    this.trie = new _trie["default"]();
    this.markovChain = new _markovchain["default"]();
  }

  _createClass(AutoSuggest, [{
    key: "process",
    value: function process(historicalEntries) {
      var _this = this;

      if (Array.isArray(historicalEntries) === false) {
        throw new TypeError("Invalid arguments. Expected an array of, received ".concat(_typeof(historicalEntries)));
      }

      historicalEntries.forEach(function (entry) {
        if (_typeof(entry) !== 'object') {
          var formatted = formatWord(entry.replace(/\s+/g, " ")).split(' ');

          if (_this.visited[formatted] !== true) {
            _this.visited[formatted] = true;

            _this.trie.add(formatted);

            _this.markovChain.record(formatted);
          }
        }
      }); //Return this so that process and generateSuggestions can be chained

      return this;
    }
  }, {
    key: "generateSuggestions",
    value: function generateSuggestions(inputValue) {
      if (!inputValue) return [];
      var splitSentence = inputValue.trim().split(' ');
      var lastWord = formatWord(splitSentence[splitSentence.length - 1]);
      var results = this.markovChain.suggest(lastWord).map(function (word) {
        return " ".concat(word);
      }).concat(this.trie.suggest(lastWord)).filter(function (result) {
        return result !== lastWord;
      });
      return _toConsumableArray(new Set(results));
    }
  }]);

  return AutoSuggest;
}();

exports["default"] = AutoSuggest;