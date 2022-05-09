import { hello, mySync } from "./hello";
import imgSrc from "./assets/longmao.png";
// import imgSrc2 from "./assets/xx.svg";//使用和png一样
// import text from "./assets/test.txt";

mySync();
hello();

const img = document.createElement("img");
img.src = imgSrc;
img.style.width = "50%";
document.body.appendChild(img);

// const block = document.createElement("div");
// block.style.cssText = "width:100px,height:100px,background:gray";
// block.textContent = text;
// document.body.appendChild(block);
