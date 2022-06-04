const btn2 = document.querySelector("#btn2");
const ul2 = document.querySelector("#ul2");

btn2.addEventListener("click", forLoopAddLi);

const total = 10000;

//很大的for循环
function forLoopAddLi() {
  const startTime = Date.now();
  let li;

  loadPart(0, 10);

  function loadPart(start, addCount) {
    if (start >= total) {
      console.log(`总耗时  ${Date.now() - startTime}`);
      return;
    }

    setTimeout(() => {
      for (let i = start; i < start + addCount; i++) {
        li = document.createElement("li");
        li.innerText = i + 1;
        ul2.appendChild(li);
      }
      loadPart(start + addCount, addCount);
    }, 0);

    // requestIdleCallback(() => {
    //   for (let i = start; i < start + addCount; i++) {
    //     li = document.createElement("li");
    //     li.innerText = i + 1;
    //     ul2.appendChild(li);
    //   }
    //   loadPart(start + addCount, addCount);
    // });
  }
}
