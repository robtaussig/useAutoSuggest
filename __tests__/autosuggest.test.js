import { AutoSuggest } from '../lib/autosuggest';

describe('React useAutoSuggest', () => {

  describe('process', () => {
    test('It takes a list of historical entries, trims, strips excess spaces and lowercases each element',() => {

    });

    test('It doesn\'t visit the same word twice',() => {

    });

    test('It calls Trie#add and MarkovChain#record for each entry',() => {

    });

    test('It returns a reference to itself to support chaining',() => {

    });
  });

  describe('generateSuggestions', () => {
    test('It returns an empty array if input paramater is falsey',() => {

    });

    //Ensure that double spaces in the input don't fail
    test('It splits the input sentence into trimmed strings delimited by one or more space characters',() => {

    });

    test('It returns suggestions based on the last word of the input sentence',() => {

    });

    test('Suggestions are prepended with a space character when they represent a suggestion for the next word',() => {

    });

    test('Suggestions are not prepended with a space character when they represent a replacement for the last word',() => {

    });

    test('Suggestions exclude a value if it is equivalent to the last word',() => {

    });

    test('Suggestions prioritize markovChain results, as they require the last word to be a valid input',() => {

    });
  });

});
