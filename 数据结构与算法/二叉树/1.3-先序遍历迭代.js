// 前序遍历：中 左 右
// 压栈顺序：右 左 中

function preorderTraversal(root) {
  if (root == null) return null;

  const stack = [];
  const res = [];

  stack.push(root);
  while (stack.length) {
    const node = stack.pop();

    if (!node) {
      res.push(stack.pop().val);
      continue;
    }

    if (node.right) stack.push(node.right); // 右
    if (node.left) stack.push(node.left); // 左

    stack.push(node); // 中
    stack.push(null); // null紧跟node
  }
  return res;
}
