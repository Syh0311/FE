// 中序遍历： 左 中 右
// 入栈顺序： 右 中 左

const midOrder = (root) => {
  if (root == null) return null;

  const stack = [];
  const res = [];
  stack.push(root);

  while (stack.length != 0) {
    let root = stack.pop();

    if (root == null) {
      res.push(root.pop().val); //再弹出一个；
      continue;
    }

    root.right && stack.push(root.right);

    stack.push(root);
    stack.push(null); //用null做进res的判断

    root.left && stack.push(root.left);
  }
};
