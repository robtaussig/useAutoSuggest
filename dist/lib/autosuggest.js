"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const markovchain_1 = require("./markovchain");
const trie_1 = require("./trie");
const formatWord = (word) => word.trim().toLowerCase();
class AutoSuggest {
    constructor() {
        this.visited = {};
        this.trie = new trie_1.default();
        this.markovChain = new markovchain_1.default();
    }
    process(historicalEntries) {
        if (Array.isArray(historicalEntries) === false) {
            throw new TypeError(`Invalid arguments. Expected an array of, received ${typeof historicalEntries}`);
        }
        historicalEntries
            .forEach(entry => {
            if (typeof entry !== 'object') {
                const formatted = formatWord(entry.replace(/\s+/g, " "));
                if (this.visited[formatted] !== true) {
                    this.visited[formatted] = true;
                    const splitByWord = formatted.split(' ');
                    this.trie.add(splitByWord);
                    this.markovChain.record(splitByWord);
                }
            }
        });
        //Return this so that process and generateSuggestions can be chained
        return this;
    }
    generateSuggestions(inputValue) {
        if (!inputValue)
            return [];
        const splitSentence = inputValue.trim().split(' ');
        const lastWord = formatWord(splitSentence[splitSentence.length - 1]);
        const results = this.markovChain.suggest(lastWord)
            .map(word => ` ${word}`)
            .concat(this.trie.suggest(lastWord))
            .filter(result => result !== lastWord);
        return [...new Set(results)];
    }
}
exports.default = AutoSuggest;
//# sourceMappingURL=autosuggest.js.map