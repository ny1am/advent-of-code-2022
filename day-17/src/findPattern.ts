const _findPattern = (arr: number[]) => {
  const dp = new Array(arr.length).fill(0);
  for (let i = 1; i < dp.length; i++) {
    let k = dp[i - 1];
    let done = false;
    while (!done) {
      if (arr[i] === arr[k]) {
        dp[i] = k + 1;
        done = true;
      } else if (k === 0) {
        dp[i] = 0;
        done = true;
      } else {
        k = dp[k - 1];
      }
    }
  }
  return arr.slice(0, arr.length - dp.at(-1));
};

const _findSequence = (arr: number[]): [number[], number] => {
  const dp = Array.from({ length: arr.length + 1 }).map((_) =>
    Array(arr.length + 1).fill(0)
  );
  let seqLength = 0;
  let index = 0;
  arr.forEach((a, i) => {
    for (let j = i + 2; j <= arr.length; j++) {
      if (a === arr[j - 1] && dp[i][j - 1] < j - i) {
        dp[i + 1][j] = dp[i][j - 1] + 1;
        if (dp[i + 1][j] > seqLength) {
          seqLength = dp[i + 1][j];
          index = Math.max(i + 1, index);
        }
      } else {
        dp[i + 1][j] = 0;
      }
    }
  });
  return [arr.slice(index - seqLength, index), index - seqLength];
};

export const findPattern = (arr: number[]) => {
  const [seq, offset] = _findSequence(arr);
  const pattern = _findPattern(seq);
  return { pattern, offset };
};
