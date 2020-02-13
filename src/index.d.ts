export default function useAutoSuggest(
  inputValue: string,
  historicalEntries: string[],
  limit?: number,
  trieDepth?: number,
): string[]
