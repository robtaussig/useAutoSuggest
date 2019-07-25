import { Trie } from '../lib/trie';

describe('React useAutoSuggest', () => {

  describe('Trie#add', () => {
    test('It throws an error if provided with any argument besides an array', () => {
      const trie = new Trie();
      expect(()=> {
        trie.add('Hello');
      }).toThrow(TypeError);
      
      expect(() => {
        trie.add(4);
      }).toThrow(TypeError);

      expect(() => {
        trie.add({ 0: 'hello', 1: 'there' });
      }).toThrow(TypeError);

      expect(() => {
        trie.add(['Hello', 'there']);
      }).not.toThrow();
    });

    test('It accepts an array of strings and returns undefined', () => {
      const trie = new Trie();

      expect(trie.add(['Hello', 'there'])).toBe(undefined);
    });

    test('Provided an array of strings, it generates a nested object representing the Trie structure', () => {
      const trie = new Trie();
      trie.add(['car', 'cab', 'cat', 'rat']);
      const rootNode = trie.rootNode;

      expect(typeof rootNode).toBe('object');
      expect(Object.keys(rootNode)).toHaveLength(2); // ['c', 'r'];
    });

    test('Completion of a word is indicated by adding the key \'*  *\', with a value of true', () => {
      const trie = new Trie();
      const rootNode = trie.rootNode;

      trie.add(['car', 'cab', 'cat', 'rat']);

      expect(rootNode['c']['a']['r']['*  *']).toEqual(true);
    });

    test('It does not mutate the input array', () => {
      const trie = new Trie();
      const inputArray = ['car', 'cab', 'cat', 'rat'];
      const cloned = [...inputArray];

      trie.add(inputArray);
  
      expect(inputArray).toEqual(cloned);
    });
  });

  describe('Trie#_findCompleteWordsAtDepth', () => {
    test('It recursively calls itself given a depth greater than 1', () => {
      const trie = new Trie();
      trie.add(['car', 'cab', 'cat', 'rat']);
      const mock = jest.spyOn(trie, '_findCompleteWordsAtDepth');
      trie._findCompleteWordsAtDepth('', trie.rootNode, 3);
      /**
       * ('', {c, r}, 3)
       * ('c', {a}, 2)
       * ('ca', {r,b,t}, 1)
       * ('car', {'*  *'}, 0)
       * ('cab', {'*  *'}, 0)
       * ('cat', {'*  *'}, 0)
       * ('r', {a}, 2)
       * ('ra', {t}, 1)
       * ('rat', {'*  *'}, 0)
       */
      expect(mock).toHaveBeenCalledTimes(9);
    });
  });

  describe('Trie#suggest', () => {
    test('It returns an empty array if the provided depth is not great enough to discover viable words', () => {
      const trie = new Trie();
      trie.add(['car', 'cab', 'cat', 'rat']);
      const result = trie.suggest('c', 1);

      expect(result).toEqual([]);
    });

    test('It returns an array of viable word continuations provided the depth is large enough', () => {
      const trie = new Trie();
      trie.add(['car', 'cab', 'cat', 'rat']);
      const result = trie.suggest('c', 2);

      expect(result).toEqual(['car', 'cab', 'cat']);
    });

    test('It returns an array of viable word continuations even if the depth is greater than necessary', () => {
      const trie = new Trie();
      trie.add(['car', 'cab', 'cat', 'rat']);
      const result = trie.suggest('c', 5);

      expect(result).toEqual(['car', 'cab', 'cat']);
    });

    test('It can handle integers and stringifed integers', () => {
      const trie = new Trie();
      trie.add([1, 123, 124, '225', '122']);
      const result = trie.suggest('1', 5);

      expect(result).toEqual(['1', '122', '123', '124']);
    });
  });

});
