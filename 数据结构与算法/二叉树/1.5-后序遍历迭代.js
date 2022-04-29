// 后续遍历：左 右 中
// 入栈顺序：中 右 左

function postOrder(node) {
  if (root == null) return null;

  const stack = [];
  const res = [];
  stack.push(node);

  while (stack.length != 0) {
    const node = stack.pop();

    if (node == null) {
      res.push(stack.pop().val); //null前一个出栈
      continue;
    }

    stack.push(node);
    stack.push(null); //紧跟着中间的就是null

    node.right && stack.push(node.right);
    node.left && stack.push(node.left);
  }
}
