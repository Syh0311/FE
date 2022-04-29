const btn2 = document.querySelector("#btn2");
const ul2 = document.querySelector("#ul2");

btn2.addEventListener("click", forLoopAddLi);

const total = 10000;

//很大的for循环
function forLoopAddLi() {
  let index = 0;
  const start = Date.now();
  function loadPart(partCount = 10) {
    if (index >= total) {
      console.log(`总耗时：`, Date.now() - start);
      return;
    }

    setTimeout(() => {
      const now = Date.now();
      for (let i = 0; i < partCount; i++) {
        const li = document.createElement("li");
        li.innerText = index;
        ul2.appendChild(li);
        index++;
      }
      // 时间计算
      // console.log(`js添加【${partCount}】个li到ul2时长`, new Date().getTime() - now);
      // setTimeout(() => {
      //   console.log(`渲染【${partCount}】个li时长`, new Date().getTime() - now);
      //   console.log("一次事件循环------------------");
      // }, 0);

      // 递归自己
      loadPart(partCount);
    }, 0);
  }
  loadPart(100);
}
