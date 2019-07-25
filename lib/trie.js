
//Because double spaces are stripped for a single space, the following string is an impossible valid entry, and thus can be relied on to be unique
const COMPLETE_WORD = '*  *';

export class Trie {
  constructor() {
    this.rootNode = {};
  }

  add(valuesArray) {
    for (let i = 0; i < valuesArray.length; i++) {
      let currentNode = this.rootNode;
      const word = valuesArray[i];
      for (let j = 0; j < word.length; j++) {
        const char = word[j];
        currentNode[char] = currentNode[char] || {};
        currentNode = currentNode[char];
      }
      currentNode[COMPLETE_WORD] = true;
    }
  }

  findCompleteWordsAtDepth(wordPrefix, node, depth) {
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
      if (typeof node[char] === 'object') suggestions.push(...this.findCompleteWordsAtDepth(wordPrefix + char, node[char], depth - 1));
    }
    return suggestions;
  }

  suggest(value) {
    let currentNode = this.rootNode;
    const suggestions = [];
    for (let i = 0; i < value.length; i++) {
      if (currentNode[value[i]] === undefined) return [];
      currentNode = currentNode[value[i]];
    }
    if (currentNode[COMPLETE_WORD]) {
      suggestions.push(value);
    };
  
    suggestions.push(...this.findCompleteWordsAtDepth(value, currentNode, 4));

    return suggestions;
  }
}

