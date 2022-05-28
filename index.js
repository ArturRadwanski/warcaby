const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const users = [];
let currentTab = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
];
const intervals = [];

app.use(express.static("static"));
app.use(express.text());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/addUser", (request, res) => {
  let req = JSON.parse(request.body);
  if (!users.includes(req.login) && users.length < 2) {
    users.push(req.login);
    let interval = setInterval(() => {
      if (users.length == 2) {
        res.send(
          JSON.stringify({
            succes: true,
            player: users[0] == req.login ? 0 : 1,
            nickname: req.login,
          })
        );
        clearInterval(interval);
      }
    }, 500);
  } else if (users.length >= 2)
    res.send(
      JSON.stringify({ succes: false, message: "w grze jest już 2 graczy" })
    );
  else
    res.send(
      JSON.stringify({ succes: false, message: "ten nick jest już zajęty" })
    );
  console.log(req);
});

app.post("/updateTab", (request, res) => {
  let req = JSON.parse(request.body);
  currentTab = req.newTab;
  let i =
    intervals.push(
      setInterval(() => {
        if (currentTab != req.newTab) {
          res.send(JSON.stringify({ success: true, tab: currentTab }));
          clearInterval(intervals[i]);
        }
      }, 500)
    ) - 1;
});

app.post("/getTab", (request, res) => {
  res.send(JSON.stringify({ tab: currentTab }));
});
app.post("/reset", (req, res) => {
  users.splice(0, users.length);
  intervals.forEach((el) => {
    clearInterval(el);
  });
  intervals.splice(0, intervals.length);
  res.send(JSON.stringify({}));
});
app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});

module.exports = app;
