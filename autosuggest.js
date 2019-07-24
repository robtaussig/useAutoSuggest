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
    historicalEntries
      .map(formatWord)
      .filter(entry => this.visited[entry] !== true)
      .forEach(entry => {
        this.visited[entry] = true;
        const doubleSpacesConsolidated = entry.replace(/\s+/g, " ").split(' ');
        
        this.trie.add(doubleSpacesConsolidated);
        this.markovChain.record(doubleSpacesConsolidated);
      });

    //Return this so that process and generateSuggestions can be chained
    return this
  }

  generateSuggestions(inputValue) {
    if (!inputValue) return [];
    const splitSentence = inputValue.trim().split(' ');
    const lastWord = formatWord(splitSentence[splitSentence.length - 1]);
    const results = this.markovChain.suggest(lastWord)
                                    .concat(this.trie.suggest(lastWord))
                                    .filter(result => result !== lastWord);
    return [...new Set(results)];
  }
}
