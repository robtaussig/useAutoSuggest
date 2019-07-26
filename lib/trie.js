const COMPLETE_WORD = Symbol('*');

export default class Trie {
  constructor() {
    this.rootNode = {};
  }

  add(valuesArray) {
    if (Array.isArray(valuesArray) === false) {
      throw new TypeError(`Invalid arguments. Expected an array, received ${typeof valuesArray}`);
    }

    for (let i = 0; i < valuesArray.length; i++) {
      let currentNode = this.rootNode;
      const word = String(valuesArray[i]);
      for (let j = 0; j < word.length; j++) {
        const char = word[j];
        currentNode[char] = currentNode[char] || {};
        currentNode = currentNode[char];
      }
      currentNode[COMPLETE_WORD] = true;
    }
  }

  suggest(value, depth = 4) {
    let currentNode = this.rootNode;
    const suggestions = [];
    const stringifiedValue = String(value);
  
    for (let i = 0; i < stringifiedValue.length; i++) {
      if (currentNode[stringifiedValue[i]] === undefined) return [];
      currentNode = currentNode[stringifiedValue[i]];
    }
  
    suggestions.push(...this._findCompleteWordsAtDepth(stringifiedValue, currentNode, depth));

    return suggestions;
  }

  _findCompleteWordsAtDepth(wordPrefix, node, depth) {
    if (depth === 0) {
      if (node[COMPLETE_WORD]) {
        return [wordPrefix];
      };
      return [];
    }
    const suggestions = [];
    if (node[COMPLETE_WORD]) {
      suggestions.push(wordPrefix);
    }

    for (let char in node) {
      if (typeof node[char] === 'object') suggestions.push(...this._findCompleteWordsAtDepth(wordPrefix + char, node[char], depth - 1));
    }
    return suggestions;
  }
}

