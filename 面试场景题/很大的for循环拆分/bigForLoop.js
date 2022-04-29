const btn = document.querySelector("#btn");
const ul = document.querySelector("#ul");

btn.addEventListener("click", eventLoopFor);

// const all = 10000;

//很大的for循环 通过事件循环将其拆分为各个小事件  避免一次GUI渲染太多 阻塞js线程
function eventLoopFor() {
  // 获取时间戳的方法
  const now = Date.now();
  console.log("[ now ]", now);
  // const now = new Date().getTime();
  // const now = new Date().valueOf();
  // const now = Date.parse(new Date());

  for (let i = 0; i < 10000; i++) {
    const li = document.createElement("li");
    li.innerText = i;
    ul.appendChild(li);
  }

  console.log("js运行时间：", new Date().getTime() - now);

  setTimeout(() => {
    console.log("总运行时间：", new Date().getTime() - now);
  }, 0);
}
