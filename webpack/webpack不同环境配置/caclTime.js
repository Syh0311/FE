function caclTime(begin, end, plan) {
  const url = document.URL;
  let mins = 0;
  const list = document.querySelector(".list-box");
  const listLen = list.childNodes.length;
  const currentP = parseInt(url.split("?")[1].split("&")[0].slice(2));
  begin = begin || currentP;
  end = end || listLen;
  end > listLen && (end = listLen);
  for (let i = begin; i < end; i++) {
    const duration = list.childNodes[i].querySelector(".duration").textContent;
    fen = parseInt(duration.slice(0, 2));
    miao = parseInt(duration.slice(3));
    mins += fen + miao / 60;
    if (plan && mins > plan) {
      return `需要看到第${i}P----共${listLen}P`;
    }
  }
  return parseFloat(mins.toFixed(2));
}

const btn = document.createElement("button", "计算时间");
document.appendChild;
