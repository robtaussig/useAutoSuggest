interface FollowCount {
  [key: string]: number
}

interface Chain {
  [key: string]: FollowCount
}

export default class MarkovChain {
  private chain: Chain = {};

  record(valuesArray: string[]): void {
    if (Array.isArray(valuesArray) === false) {
      throw new TypeError(`Invalid arguments. Expected an array, received ${typeof valuesArray}`);
    }

    let currentWord = valuesArray[0];
    for (let i = 1; i < valuesArray.length; i++) {
      const nextWord = valuesArray[i];
      this.chain[currentWord] = this.chain[currentWord] || {};
      this.chain[currentWord][nextWord] = this.chain[currentWord][nextWord] || 0;
      this.chain[currentWord][nextWord]++;
      currentWord = nextWord;
    }
  }

  suggest(value:string): string[] {
    if (this.chain[value]) {
      return Object.entries(this.chain[value])
        .sort(([aKey, aValue], [bKey, bValue]) => aValue > bValue ? -1 : 1)
        .map(([key, value]) => key);
    }
    return [];
  }
}
