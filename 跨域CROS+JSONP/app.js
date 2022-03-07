const express = require("express");

//90端口，作为HTTP服务
const app = express();
app.use(express.static(__dirname));
app.listen(90);

//91端口，返回数据，作为数据库请求

// CROS
const app2 = express();
app2.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.end("server response -----------");
});
app2.listen(91);

//JSONP
const app3 = express();
app3.get("/", (req, res) => {
  const callback = req.query.callback;
  console.log(callback);
  res.end(`${callback}('server response -----------')`);
});
app3.listen(92);
