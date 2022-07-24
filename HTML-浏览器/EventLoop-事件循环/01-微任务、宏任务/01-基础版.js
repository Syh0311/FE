setTimeout(() => {
  console.log("sto");
  requestAnimationFrame(() => console.log("rAF"));
});
setTimeout(() => {
  console.log("sto");
  requestAnimationFrame(() => console.log("rAF"));
});

queueMicrotask(() => console.log("mic"));
queueMicrotask(() => console.log("mic"));
