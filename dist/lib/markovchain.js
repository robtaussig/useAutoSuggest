"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MarkovChain =
/*#__PURE__*/
function () {
  function MarkovChain() {
    _classCallCheck(this, MarkovChain);

    this.chain = {};
  }

  _createClass(MarkovChain, [{
    key: "record",
    value: function record(valuesArray) {
      if (Array.isArray(valuesArray) === false) {
        throw new TypeError("Invalid arguments. Expected an array, received ".concat(_typeof(valuesArray)));
      }

      var currentWord = valuesArray[0];

      for (var i = 1; i < valuesArray.length; i++) {
        var nextWord = valuesArray[i];
        this.chain[currentWord] = this.chain[currentWord] || {};
        this.chain[currentWord][nextWord] = this.chain[currentWord][nextWord] || 0;
        this.chain[currentWord][nextWord]++;
        currentWord = nextWord;
      }
    }
  }, {
    key: "suggest",
    value: function suggest(value) {
      if (this.chain[value]) {
        return Object.entries(this.chain[value]).sort(function (_ref, _ref2) {
          var _ref3 = _slicedToArray(_ref, 2),
              aKey = _ref3[0],
              aValue = _ref3[1];

          var _ref4 = _slicedToArray(_ref2, 2),
              bKey = _ref4[0],
              bValue = _ref4[1];

          return aValue > bValue ? -1 : 1;
        }).map(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              key = _ref6[0],
              value = _ref6[1];

          return key;
        });
      }

      return [];
    }
  }]);

  return MarkovChain;
}();

exports["default"] = MarkovChain;