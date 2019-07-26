"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var COMPLETE_WORD = Symbol('*');

var Trie =
/*#__PURE__*/
function () {
  function Trie() {
    _classCallCheck(this, Trie);

    this.rootNode = {};
  }

  _createClass(Trie, [{
    key: "add",
    value: function add(valuesArray) {
      if (Array.isArray(valuesArray) === false) {
        throw new TypeError("Invalid arguments. Expected an array, received ".concat(_typeof(valuesArray)));
      }

      for (var i = 0; i < valuesArray.length; i++) {
        var currentNode = this.rootNode;
        var word = String(valuesArray[i]);

        for (var j = 0; j < word.length; j++) {
          var _char = word[j];
          currentNode[_char] = currentNode[_char] || {};
          currentNode = currentNode[_char];
        }

        currentNode[COMPLETE_WORD] = true;
      }
    }
  }, {
    key: "suggest",
    value: function suggest(value) {
      var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
      var currentNode = this.rootNode;
      var suggestions = [];
      var stringifiedValue = String(value);

      for (var i = 0; i < stringifiedValue.length; i++) {
        if (currentNode[stringifiedValue[i]] === undefined) return [];
        currentNode = currentNode[stringifiedValue[i]];
      }

      suggestions.push.apply(suggestions, _toConsumableArray(this._findCompleteWordsAtDepth(stringifiedValue, currentNode, depth)));
      return suggestions;
    }
  }, {
    key: "_findCompleteWordsAtDepth",
    value: function _findCompleteWordsAtDepth(wordPrefix, node, depth) {
      if (depth === 0) {
        if (node[COMPLETE_WORD]) {
          return [wordPrefix];
        }

        ;
        return [];
      }

      var suggestions = [];

      if (node[COMPLETE_WORD]) {
        suggestions.push(wordPrefix);
      }

      for (var _char2 in node) {
        if (_typeof(node[_char2]) === 'object') suggestions.push.apply(suggestions, _toConsumableArray(this._findCompleteWordsAtDepth(wordPrefix + _char2, node[_char2], depth - 1)));
      }

      return suggestions;
    }
  }]);

  return Trie;
}();

exports["default"] = Trie;