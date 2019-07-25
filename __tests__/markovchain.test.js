import MarkovChain from '../lib/markovchain';

describe('React useAutoSuggest', () => {

  describe('record', () => {
    test('It throws an error if provided with any argument besides an array', () => {
      const markovChain = new MarkovChain();
      expect(()=> {
        markovChain.record('Hello');
      }).toThrow(TypeError);
      
      expect(() => {
        markovChain.record(4);
      }).toThrow(TypeError);

      expect(() => {
        markovChain.record({ 0: 'hello', 1: 'there' });
      }).toThrow(TypeError);

      expect(() => {
        markovChain.record(['Hello', 'there']);
      }).not.toThrow();
    });

    test('It accepts an array of strings and returns undefined', () => {
      const markovChain = new MarkovChain();

      expect(markovChain.record(['Hello', 'there'])).toBe(undefined);
    });

    test('Provided an array of strings, it generates a nested object of word combinations', () => {
      const markovChain = new MarkovChain();
      markovChain.record(['i', 'am', 'dog']);
      markovChain.record(['i', 'like', 'dog']);
      markovChain.record(['you', 'are','dog']);
      markovChain.record(['they', 'are', 'dog']);
      const chain = markovChain.chain;

      expect(typeof chain).toBe('object');
      expect(Object.keys(chain)).toHaveLength(6); // ["i", "am", "like", "you", "are", "they"]; -- Every unique word that isn't in last position
    });

    test('The value of a word combination will be the number of times it showed up in the input data', () => {
      const markovChain = new MarkovChain();
      markovChain.record(['i', 'am', 'dog']);
      markovChain.record(['i', 'like', 'dog']);
      markovChain.record(['you', 'are','dog']);
      markovChain.record(['they', 'are', 'dog']);
      const chain = markovChain.chain;

      const combination = chain['are']['dog'];
      expect(combination).toBe(2);
    });
  });

  describe('suggest', () => {
    test('It returns an empty array if there are no continuations from the given argument', () => {
      const markovChain = new MarkovChain();
      markovChain.record(['i', 'like', 'to', 'party']);
      markovChain.record(['i', 'like', 'food']);
      const result = markovChain.suggest('love');

      expect(result).toEqual([]);
    });

    test('It returns an array of viable word continuations if they exist', () => {
      const markovChain = new MarkovChain();
      markovChain.record(['i', 'like', 'to', 'party']);
      markovChain.record(['i', 'like', 'food']);
      const result = markovChain.suggest('like');

      expect(result).toEqual(['to', 'food']);
    });

    test('It orders the suggested words based on the frequency the combination occurred', () => {
      const markovChain = new MarkovChain();
      const markovChainWithoutPriority = new MarkovChain();

      markovChain.record(['i', 'like', 'to', 'party']);
      markovChainWithoutPriority.record(['i', 'like', 'to', 'party']);

      markovChain.record(['i', 'like', 'food']);
      markovChainWithoutPriority.record(['i', 'like', 'food']);

      markovChain.record(['i', 'like', 'food', 'because', 'it', 'tastes', 'good']);
      const result = markovChain.suggest('like');
      const resultWithoutPriority = markovChainWithoutPriority.suggest('like');
    
      expect(result[0]).toEqual('food');
      expect(resultWithoutPriority[0]).toEqual('to');
    });
  });

});
