function cloneLoop(x) {
  const root = {};

  // 栈
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x,
    },
  ];

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = key == undefined ? parent : parent[key];
    // res = Array.isArray(data) ? [] : {};

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === "object") {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }

  return root;
}

const obj = {
  a: 1,
  b: ["e", "f", "g"],
  c: { h: 20 },
  d: function () {},
};

const clone = cloneLoop(obj);
console.log(clone === obj);
console.log(clone);
console.log(obj);
