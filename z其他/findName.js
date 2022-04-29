let data = [
  {
    name: "1-1",
    kind: "oo",
    children: [
      {
        name: "2-2",
        kind: "ii",
      },
      {
        name: "3-3",
        children: [
          {
            name: "4-4",
          },
        ],
      },
    ],
  },
  {
    name: "5-5",
  },
];

// const result = []

function findName(arr, result = []) {
  if (arr.length == 0) return;
  arr.forEach((el) => {
    el.name && result.push(el.name);
    if (el.children) {
      findName(el.children, result);
    }
  });
  return result;
}

const res = findName(data);
console.log(res);
