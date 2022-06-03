function testWeightBagProblem(wight, value, size) {
  const len = wight.length,
    dp = Array.from({ length: len + 1 }).map(() => Array(size + 1).fill(0));
  // Array.from({ length: len + 1 }); //{ length: len + 1 }被当做ArrayLike

  for (let i = 1; i <= len; i++) {
    for (let j = 0; j <= size; j++) {
      if (wight[i - 1] <= j) {
        dp[i][j] = Math.max(dp[i - 1][j], value[i - 1] + dp[i - 1][j - wight[i - 1]]);
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  console.table(dp);

  return dp[len][size];
}

function testWeightBagProblem2(wight, value, size) {
  const len = wight.length,
    dp = Array(size + 1).fill(0);
  for (let i = 1; i <= len; i++) {
    for (let j = size; j >= wight[i - 1]; j--) {
      dp[j] = Math.max(dp[j], value[i - 1] + dp[j - wight[i - 1]]);
    }
  }
  return dp[size];
}

function test() {
  console.log(testWeightBagProblem([1, 3, 4, 5], [15, 20, 30, 55], 6));
}

test();
