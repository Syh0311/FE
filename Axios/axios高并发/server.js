const koa = require("koa");
const cros = require("@koa/cors");
const app = new koa();

function sleep(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds);
  });
}
app.use(cros());
app.use(async (ctx, next) => {
  if (ctx.url === "/test") {
    await sleep(200);

    const n = Math.random();
    console.log(n);
    if (n > 0.8) {
      ctx.body = n;
    } else {
      ctx.status = 404;
      ctx.body = "";
    }
    next();
  }
});

app.listen(3000, "127.0.0.1", () => console.log("start listening on port 127.0.0.1:3000"));
