import AutoSuggest from '../lib/autosuggest';

describe('React useAutoSuggest', () => {

  describe('process', () => {

    test('It throws an error if provided with any argument besides an array', () => {
      const autoSuggest = new AutoSuggest();
      expect(()=> {
        autoSuggest.process('Hello');
      }).toThrow(TypeError);
      
      expect(() => {
        autoSuggest.process(4);
      }).toThrow(TypeError);

      expect(() => {
        autoSuggest.process({ 0: 'hello', 1: 'there' });
      }).toThrow(TypeError);

      expect(() => {
        autoSuggest.process(['Hello', 'there']);
      }).not.toThrow();
    });
    
    test('It calls Trie#add and MarkovChain#record for each entry',() => {
      const autoSuggest = new AutoSuggest();
      const trieSpy = jest.spyOn(autoSuggest.trie, 'add');
      const markovChainSpy = jest.spyOn(autoSuggest.markovChain, 'record');
      const input = ['Hello my name is Rob'];
      const secondInput = ['Hi there'];
      autoSuggest.process(input);
      autoSuggest.process(secondInput);

      expect(trieSpy).toHaveBeenCalledTimes(2);
      expect(markovChainSpy).toHaveBeenCalledTimes(2);
    });

    test('It doesn\'t visit the same word twice',() => {
      const autoSuggest = new AutoSuggest();
      const spy = jest.spyOn(autoSuggest.trie, 'add');
      const input = ['Hello my name is Rob'];
      const secondInput = ['Hi there'];
      const thirdInput = ['Hello my name is Rob'];
      autoSuggest.process(input);
      autoSuggest.process(secondInput);
      autoSuggest.process(thirdInput);

      expect(spy).toHaveBeenCalledTimes(2);
    });

    test('It returns a reference to itself to support chaining',() => {
      const autoSuggest = new AutoSuggest();
      const input = ['Hello my name is Rob'];

      expect(autoSuggest.process(input) instanceof AutoSuggest).toBe(true);
    });
  });

  describe('generateSuggestions', () => {
    const autoSuggest = new AutoSuggest();
    const input = ['Hello my name is Rob, and my favorite day is Friday.'];
    const secondInput = ['Hi there, my favorite month is January.'];
    const inputWithDoubleSpace = ['Hello  my name is  Rob, and my favorite day is Friday.'];
    autoSuggest.process(input);
    autoSuggest.process(secondInput);

    test('It returns an empty array if input paramater is falsey',() => {
      expect(autoSuggest.generateSuggestions('')).toEqual([]);
    });

    test('It splits the input sentence into trimmed strings delimited by one or more space characters',() => {
      const spy = jest.spyOn(autoSuggest.trie, 'add');
      autoSuggest.process(inputWithDoubleSpace);
      expect(spy).toBeCalledTimes(0);
    });

    test('It returns suggestions based on the last word of the input sentence',() => {
      expect(autoSuggest.generateSuggestions('My favori')).not.toEqual(['favorite ']);
      expect(autoSuggest.generateSuggestions('My favori')).toEqual(['favorite']);
    });

    test('Suggestions are prepended with a space character when they represent a suggestion for the next word',() => {
      expect(autoSuggest.generateSuggestions('Hello')[0][0]).toEqual(' ');
    });

    test('Suggestions are not prepended with a space character when they represent a replacement for the last word',() => {
      expect(autoSuggest.generateSuggestions('Hell')[0][0]).not.toEqual(' ');
    });

    test('Suggestions exclude a value if it is equivalent to the last word',() => {
      expect(autoSuggest.generateSuggestions('Hello').some(match => /hello|Hello/.test(match))).toBe(false);
    });

    test('Suggestions prioritize markovChain results, as they require the last word to be a valid input',() => {
      expect(autoSuggest.generateSuggestions('my')[0]).toEqual(' favorite');
    });
  });

});
