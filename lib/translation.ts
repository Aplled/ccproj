export type LossSegment = {
  text: string;
  status: "kept" | "lost";
};

export type AnalyzeResult = {
  translated: string;
  roundTrip: string;
  lossScore: number;
  notes: string;
  segments: LossSegment[];
};

type Token = {
  text: string;
  word: boolean;
  key: string;
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const pattern = /(\p{L}+|\p{N}+)|([^\p{L}\p{N}]+)/gu;
  for (const match of input.matchAll(pattern)) {
    const text = match[0];
    const word = match[1] !== undefined;
    tokens.push({ text, word, key: word ? text.toLowerCase() : text });
  }
  return tokens;
}

function keptFlags(original: Token[], other: Token[]): boolean[] {
  const a = original.filter((t) => t.word).map((t) => t.key);
  const b = other.filter((t) => t.word).map((t) => t.key);

  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const kept: boolean[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length) {
    if (j < b.length && a[i] === b[j]) {
      kept.push(true);
      i++;
      j++;
    } else if (j < b.length && dp[i + 1][j] < dp[i][j + 1]) {
      j++;
    } else {
      kept.push(false);
      i++;
    }
  }
  return kept;
}

export function compareRoundTrip(
  original: string,
  roundTrip: string
): Pick<AnalyzeResult, "lossScore" | "notes" | "segments"> {
  const tokens = tokenize(original);
  const kept = keptFlags(tokens, tokenize(roundTrip));

  const segments: LossSegment[] = [];
  let wordIndex = 0;
  let lostWords = 0;
  let totalWords = 0;

  for (const token of tokens) {
    let status: LossSegment["status"] = "kept";
    if (token.word) {
      totalWords++;
      if (!kept[wordIndex]) {
        status = "lost";
        lostWords++;
      }
      wordIndex++;
    }
    const last = segments[segments.length - 1];
    if (last && last.status === status) {
      last.text += token.text;
    } else {
      segments.push({ text: token.text, status });
    }
  }

  const lossScore = totalWords === 0 ? 0 : lostWords / totalWords;
  const notes = `${lostWords} of ${totalWords} words changed after translating back to the original language.`;

  return { lossScore, notes, segments };
}
