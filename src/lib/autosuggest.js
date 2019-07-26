import MarkovChain from './markovchain';
import Trie from './trie';

const formatWord = word => word.trim().toLowerCase();

export default class AutoSuggest {
  constructor() {
    this.visited = {};
    this.trie = new Trie();
    this.markovChain = new MarkovChain();
  }

  process(historicalEntries) {
    if (Array.isArray(historicalEntries) === false) {
      throw new TypeError(`Invalid arguments. Expected an array of, received ${typeof historicalEntries}`);
    }

    historicalEntries
      .forEach(entry => {
        if (typeof entry !== 'object') {
          const formatted = formatWord(entry.replace(/\s+/g, " ")).split(' ');
          if (this.visited[formatted] !== true) {
            this.visited[formatted] = true;
            this.trie.add(formatted);
            this.markovChain.record(formatted);
          }
        }
      });

    //Return this so that process and generateSuggestions can be chained
    return this
  }

  generateSuggestions(inputValue) {
    if (!inputValue) return [];
    const splitSentence = inputValue.trim().split(' ');
    const lastWord = formatWord(splitSentence[splitSentence.length - 1]);
    const results = this.markovChain.suggest(lastWord)
                                    .map(word => ` ${word}`)
                                    .concat(this.trie.suggest(lastWord))
                                    .filter(result => result !== lastWord);
    return [...new Set(results)];
  }
}
