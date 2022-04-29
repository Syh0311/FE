// !!!！！！

Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log);

// 答案
// .then 和 .catch 的【期望参数】都是函数，若参数不是函数，则会发生【值穿透】，类似【错误穿透】
