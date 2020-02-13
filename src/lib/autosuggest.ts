import MarkovChain from './markovchain';
import Trie from './trie';

const formatWord = (word: string):string => word.trim().toLowerCase();

interface Visited {
  [key: string]: boolean
}

export default class AutoSuggest {
  private visited: Visited = {};
  private trie: Trie = new Trie();
  private markovChain: MarkovChain = new MarkovChain();
  constructor(readonly trieDepth = 4) {}

  process(historicalEntries:string[]):AutoSuggest {
    if (Array.isArray(historicalEntries) === false) {
      throw new TypeError(`Invalid arguments. Expected an array of, received ${typeof historicalEntries}`);
    }

    historicalEntries
      .forEach(entry => {
        if (typeof entry !== 'object') {
          const formatted:string = formatWord(entry.replace(/\s+/g, " "));
          if (this.visited[formatted] !== true) {
            this.visited[formatted] = true;
            const splitByWord = formatted.split(' ');
            this.trie.add(splitByWord);
            this.markovChain.record(splitByWord);
          }
        }
      });

    //Return this so that process and generateSuggestions can be chained
    return this
  }

  generateSuggestions(inputValue:string):string[] {
    if (!inputValue) return [];
    const isNewWord = inputValue.endsWith(' ');
    const splitSentence = inputValue.trim().split(' ');
    const lastWord = formatWord(splitSentence[splitSentence.length - 1]);
    const results = this.markovChain.suggest(lastWord)
                                    .map(word => ` ${word}`)
                                    .concat(isNewWord ? [] : this.trie.suggest(lastWord, this.trieDepth))
                                    .filter(result => result !== lastWord);
    return [...new Set(results)];
  }
}
