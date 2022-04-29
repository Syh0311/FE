function pow(num) {
  while (true) {
    let mid = num >> 1;
    if (mid * mid > num) {
      mid = mid >> 1;
    }
  }
}
