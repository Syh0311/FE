function levelOrder(node) {
  if (node == null) return null;

  const queue = [];
  const res = []; //最终为二维数组
  while (queue.length != 0) {
    const curLevelValues = [];
    const len = queue.length;

    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      curLevelValues.push(node.val);

      //还在queue中加就行，已经写死了len
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
    // for循环完后上一层的全部清除，queue中只有下一层的
    res.push(curLevelValues);
  }
  return res;
}
