## [preventDefault,stopPropagation 及 return false 的区别](https://segmentfault.com/a/1190000008227026)

1. `preventDefault`
   - 阻止点击的标签的默认行为
   - 如 a 标签点击后发生跳转，使用 preventDefault 后不跳转
2. `stopPropagation`
   - 阻止事件【如 click】沿着`传播链`传播
   - 如果为冒泡【`默认情况`】，则`不向上`传播
   - 如果为捕获【`useCapture:true`】，则`不向下`传播
3. return flase
   - 是 juery 的语法糖
   - 为两者的结合
