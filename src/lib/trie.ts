const COMPLETE_WORD = Symbol('*');

type TrieNode = {
  [key: string]: TrieNode,
  [COMPLETE_WORD]?: boolean,
}

export default class Trie {
  private rootNode: TrieNode = {};

  add(valuesArray: string[]): void {
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

  suggest(value: string, depth = 4): string[] {
    let currentNode = this.rootNode;
    const suggestions = [];
    const stringifiedValue = String(value);
  
    for (let i = 0; i < stringifiedValue.length; i++) {
      if (currentNode[stringifiedValue[i]] === undefined) return [];
      currentNode = currentNode[stringifiedValue[i]];
    }
  
    suggestions.push(...this.findCompleteWordsAtDepth(stringifiedValue, currentNode, depth));

    return suggestions;
  }

  private findCompleteWordsAtDepth(wordPrefix: string, node: TrieNode, depth: number): string[] {
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
}

