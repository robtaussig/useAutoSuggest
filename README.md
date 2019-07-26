# useAutoSuggest React Hook
Performant, hybrid auto-suggest system that accepts an input string and returns an array of word completions and/or suggested next words (if the provided input is a known word itself).

## Online Demo
Begins with a fresh slate. You can enter text into the textarea and 'train' the autosuggest, so future suggestions will be guided by your previous inputs, or you can test performance by training it with the entire play of A Midsummer Night's Dream (text is dynamically imported, parsed, and processed on the button click)

[Link](https://cbdz9.csb.app/)

## Why
I had a few goals in mind while developing this tool:
1) First and foremost, I of course wanted a performant solution to taking user input and returning a list of values that are *probably* what the user intends to enter,
2) I was building an application to be used entirely offline, so I couldn't rely on offloading the work to a server,
3) I wanted the suggestions to be *contextual*. I am more likely as a user to enter certain values in a title than I am in a description, and vice versa,
4) I didn't want to download and store in memory 2mb of the English dictionary (assuming 170k words @ an average word length of 6 characters, and 2 bytes per character) for one feature of my application

## Getting Started
```
yarn add react-use-autosuggest
```

## Run tests
```
yarn test
```

## Example Useage
```js
import React, { useState, useCallback, todos } from 'react';
import useAutoSuggest from 'react-use-autosuggest';

const todos = [
  {
    title: 'Clean Kitchen',
    description: 'The kitchen is getting messy and needs to be taken care of',
  },
  {
    title: 'Clean Bathroom',
    description: 'Have already taken out the trash but need to clean the sink as well',
  },
  {
    title: 'Call Mom',
    description: 'Already tried once, but have to call again',
  }
];

export const DemoComponent = () => {
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

  // Important to map using useMemo so that
  // useAutoSuggest does not re-process the 
  // data every time the component updates,
  // as Array.map returns a new reference.
  const previousTitles = useMemo(() => {
    return todos.map(({ title }) => title);
  }, [todos]);
  const previousDescriptions = useMemo(() => {
    return todos.map(({ description }) => description);
  }, [todos]);

  const titleSuggestions = useAutoSuggest(
    titleInput, previousTitles
  );
  const descriptionSuggestions = useAutoSuggest(
    descriptionInput, previousDescriptions
  );

  const handleTitleInput = useCallback(e => {
    setTitleInput(e.target.value);
  }, []);
  const handleDescriptionInput = useCallback(e => {
    setDescriptionInput(e.target.value);
  }, []);

  return (
    <form>
      <input
        type="text"
        value={titleInput}
        name="title"
        onChange={handleTitleInput}
      >
      <textarea
        onChange={handleDescriptionInput}
        name="description"
      >
        {descriptionInput}
      </textarea>
      //Custom solution to display suggestions
    </form>
  )
};
  
```
```
// Title input

1) User types 'c' into the title field
2) titleSuggestions is returned as ['clean', 'call']
3) User types/selects 'clean' into the title field
4) titleSuggestions is returned as [' kitchen', ' bathroom'] (note the space preceeding word continuations)
5) User selects ' kitchen', resulting in the title input to have a value of 'clean kitchen'
6) No more values are returned because kitchen is a valid word and the input data does not contain any continuations from 'kitchen' (there are in previousDescriptions, but not previousTitles)

// Description input

1) User types 'c' into the description textfield
2) descriptionSuggestions is returned as ['care', 'clean', 'call']
3) Use types/selects 'clean' into the description textfield
4) descriptionSuggestions is returned as [' the'], which based on the user's previous behavior, is more likely to reflect their intent in the description field as it does in the title field (where the previous suggestions were the target of the verb, instead of 'the')
5) User types/selects ' the', which changes the descriptionInput to 'clean the'
6) descriptionSuggestions is returned as [' trash']
7) Assuming the user likes to click on shiny buttons, this can result in an infinite loop going from ' trash' -> ' but' -> ' need'* -> ' to'** -> ' clean' -> ' the'*** -> ' trash' -> ...

* will also include the option of 'needs' as that is also a valid word from the first description
** will also have ' be' and ' call' as possible options
*** will also have ' sink' as a viable continuation
```

## How is this performant?
This tool utilizes two abstract data structures to generate its suggestions: tries, and Markov Chains. The former can be used for many applications, but primarily -- it can take a string of characters and tell you if they form a valid word, and more importantly it can be used to determine what characters (if any) can follow from a given string, and when (not whether, as only possible continuations are available to test in the first place) those continuations produce a valid word. The latter determines the likelihood that one word will follow a given word over another. A simplified example of these two in action:

### Tries

```js
const inputData = ['car', 'cat', 'cab', 'cats'];
//A trie will process the input data and create a tree of nodes, each node representing a character that points to other nodes. In a naive form, the above input might look something like:

const rootNode = {
  next: {
    c: {
      next: {
        a: {
          next: {
            r: {
              next: {},
              isWord: true,
            },
            t: {
              next: {
                s: {
                  next: {},
                  isWord: true,
                }
              },
              isWord: true,
            },
            b: {
              next: {},
              isWord: true,
            },
          },
          isWord: false,
        }
      },
      isWord: false,
    }
  },
  isWord: false,
};
//The above can be improved by removing the `next` key altogether and simply pointing to an object of key value pairs as such:

const rootNode = {
  c: {
    a: {
      r: {},
      t: {
        s: {},
      },
      b: {},
    }
  }
};
//The above is clearly more space efficient and easier to digest, but it doesn't indicate whether a word is valid or not (We can't assume an empty object is the only indicator of a valid word, as c -> a -> t does not point to an empty object). One solution might be:

const validWord = '*';

const rootNode = {
  c: {
    a: {
      r: {
        '*': true,
      },
      t: {
        s: {},
        '*': true,
      },
      b: {
        '*': true,
      },
    }
  }
};
//Now we're talking. Given an input of 'ca', we can derive the ouput using simple indexing:

//In practice we should check for undefined values before indexing into nested structures. Or we can travel into the future and use nullish coalescing (https://github.com/tc39/proposal-nullish-coalescing)
const result = rootNode['c']['a']
/*
{
  r: {
    '*': true,
  },
  t: {
    s: {},
    '*': true,
  },
  b: {
    '*': true,
  },
}
*/

//If we iterated over the entries of result, we would hit all possible character continuations along with an object containing their continuations. At each level, we would check to see if the key is equal to '*' (which would be bad practice if an asterisk is a valid character in your input form):

result.entries.forEach(([char, next]) => {
  if (char === validWord) {
    console.log(`The given input is a valid word`);
  } else {
    console.log(`${char} is a possible continuation`);
    console.log(`With the next valid characters being ${Object.keys(next).join(', ')}`);
  }
});

//Because every node is identical in form, we can do this recursively:

const findValidWords = (prefix, node, depth = Number.MAX_SAFE_INTEGER) => {
  if (depth === 0) {
    if (node['*'] === true) {
      return [prefix];
    }

    return [];
  }

  const validWords = [];

  Object.entries(node).forEach(([char, next]) => {
    if (char === '*') {
      validWords.push(prefix);
    }
    validWords.push(...findValidWords(prefix + char, next, depth - 1));
  });

  return validWords;
};

findValidWords('ca', result);
=> [ 'car', 'cats', 'cat', 'cab' ]
```

#### But, but, HashMaps
If our only goal was to determine whether a string is a valid word, HashMaps sound pretty appealing. You can store all valid words as keys, and look them up in constant time. But what HashMaps are entirely unequipped to do is find near-matches. How would you use a HashMap to determine that you can derive 'car', 'cats', 'cat', and 'cab' given an input of 'ca'?

#### And what about on-demand search?
If we kept the list of valid words as an array, and simply filtered it by checking if each value started with the input value, the time complexity is n * m (n being the number of words in the list, and m being the length of the input value as you compare each character). There are optimizations you can use, such as sorting the list in advance, iterating through until you match all characters and then collect the remaining words until you do not match all characters (and perhaps instead of iterating through a sorted list, you can shave off some time with binary searching at each character index). Regardless, that was exhausting just describing it at a high-level...

#### The time complexity of using a Trie
Since indexing into an object is constant time, determining whether an input is a valid word takes O(n) time (n being the length of the input value) as you need to iterate through each character and look it up in an object/map. As for finding valid continuations, it is m * k (m being the number of valid words remaining for the input value and k being the number of additional characters required to complete the longest continuation).

#### Are we nitpicking here?
Compared to searching an array of valid words, is O(n) really that much better than n * m? Aren't we only worried about the big scary ones like quadratic, exponential, factorial, etc? What if we are using a list of 100,000 words as our datasource? Looking for valid continuations of 'xylophon' would take 8 operations with a Trie (to determine that it is not a valid word), and 1 more operation to determine that you can append an 'e' to make it valid. In an array, you would be searching 100,000 entries trying to match against an 8 character string at each check, so 800,000 operations (worst-case, and in truth I'm probably being unfair as this is assuming a very naive approach was taken).

#### What's the catch?
The catch is space complexity can be a bit difficult to understand/predict. In the above example of `['car', 'cat', 'cab', 'cats']`, a total of 9 key-value pairs are created. If we added the word `cable`, then 3 more key-value pairs are created (l, e, and the character representing the completion of `cable`). There are some nice synergies however -- the larger the dataset, earlier nodes will be used multiple times across different words (think of nodes as prefixes, with each node along the path to that node as a character). So adding `xylophones` to a trie that has already processed `xylophone` will require 2 extra key-value pairs (unless there is a longer word that already existed that continues from `xylophones`, in which case we would only be adding the completion marker), whereas in an array, we would need to add all 9 characters.

### Markov Chains
Markov Chains are not entirely different from tries, except instead of mapping valid sequences, it predicts the likelihood of one piece following another based on its current state. So if our datasource consists of one sentence: `The dog is happy when the dog is outside, especially when the weather is warm`, and the input value is `the`, a Markov Chain would determine that the next word after `the` is probably `dog`, because in the datasource, `dog` follows `the` twice, whereas the only other word to follow `the` was `weather`, which only followed once. In the context of this tool, an array of `the` and `weather` would be returned, sorted in descending order by frequency (so `the` first). There isn't a specific data-structure, but a simple one representing the above sentence would be:

```js
const markovChain = {
  the: {
    dog: 2,
    weather: 1,
  },
  dog: {
    is: 2,
  },
  is: {
    happy: 1,
    outside: 1,
    warm: 1,
  },
  happy: {
    when: 1,
  },
  when: {
    the: 2,
  },
  weather: {
    is: 1,
  },
  warm: {

  },
}
//So given an inputValue of `is`, we would iterate over each key in markoveChain['is'], and then sort the keys by the value of markovChain['is'][<key>], which in this case would be `happy`, `outside`, and `warm` in an arbitrary order (each having 1 occurence).
```
## What this is not
An important (and perhaps obvious) caveat of this tool is that it requires data to be provided in order to inform what it should consider desired outputs. If you want, you can hard-code an array of every word in the English dictionary and feed it to the hook in advance. It will take a bit of (computer) time to build the trie and markovChain (less than a second), but going forward it will process inputs at virtually the same speed as if it was provided a paragraph of information. But in my opinion, the power of this tool comes in your ability to train it to deliver results based on different contexts, and can even evolve over the current session, as every time the user enters a value that modifies the datasource (e.g., titles of all todos created), the future suggestions become more accurate.
