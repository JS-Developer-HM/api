import express from "express";
import ew from "express-ws";

var app = express();
ew(app);

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNMCSt8MzhBLUztKYD0foentDYksxfkdk",
  authDomain: "hm-firebase.firebaseapp.com",
  databaseURL: "https://hm-firebase.firebaseio.com",
  projectId: "hm-firebase",
  storageBucket: "hm-firebase.appspot.com",
  messagingSenderId: "532107147658",
  appId: "1:532107147658:web:da77861842d2a9b8d1f073",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();

var o = {};
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
app.use(async function (req, res, next) {
  console.log("middleware");
  req.testing = "testing";
  return next();
});

app.get("/", function (req, res, next) {
  console.log("get route", req.testing);
  res.end();
});

app.ws("/:x", async function (ws, req) {
  if (req.params.x == "abc") {
    await ws.on("message", async function (msg) {
      var admin = await doc(db, "$_Admin", "7HQuAN7yHzfiG7FDYCCsrktEdso1");
      var data = await getDoc(admin);
      // db
      //   .collection("$_Admin")
      //   .doc("7HQuAN7yHzfiG7FDYCCsrktEdso1")
      //   .get();

      console.log(data.data());
      if (msg == "master") {
        o[req.params.x] = {
          master: ws,
          slaves: o[req.params.x]?.slaves || [],
        };
        ws.send("master done");
        o[req.params.x].slaves.forEach((s) => {
          s.send("master back");
        });
        ws.on("close", () => {
          console.log("master close");
          o[req.params.x].slaves.forEach((s) => {
            s.send("master close");
            // s.close();
          });
        });
      } else if (msg == "slave" && o[req.params.x]) {
        o[req.params.x].slaves.push(ws);
        o[req.params.x].master.send("slave com");
        ws.send("slave done");
      } else {
        ws.send("master not found");
      }
    });
  }
});

app.listen(3000);
