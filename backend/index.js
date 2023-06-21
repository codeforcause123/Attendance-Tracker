require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const jsdom = require("jsdom");
const HtmlTableToJson = require("html-table-to-json");
const { JSDOM } = jsdom;
let savedData = null;
let attendance = null;
async function fetchReport(email, password) {
  const result = await fetch("https://quiklrn.com/login.php", {
    method: "GET",
    redirect: "follow",
  });
  const cookie = await result.headers.get("set-cookie").slice(0, -7);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Cookie", cookie);
  var urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("password", password);
  const res = await fetch("https://quiklrn.com/user/login.php", {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
    credentials: "include",
  });
  const report = await fetch("https://quiklrn.com/user/report.php", {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  });
  const dom = new JSDOM(await report.text());
  const table = dom.window.document.querySelector(
    ".table-responsive:nth-child(6) > .table"
  ).outerHTML;
  return HtmlTableToJson.parse(table).results;
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log(req.path, req.method);
  next();
});
app.get("/bfhl", (req, res) => {
  res.json({ operation_code: 1 });
});
const saveData = async (req, res) => {
  const { email, password } = req.body;
  savedData = req.body;
  console.log(savedData);
  try {
    const result = await fetchReport(email, password);
    attendance = result[0];
    const transformedData = attendance.map((obj) => {
      const newObj = {};
      Object.keys(obj).forEach((key) => {
        const newKey = key.replace(/[^a-zA-Z]/g, "");
        newObj[newKey] = obj[key];
      });
      return newObj;
    });
    res.json({ success: true, transformedData });
    console.log(transformedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "An error occurred" });
  }
};
app.post("/api/save", saveData);

const getUsername = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Received username: ${email} ${password}`);
    res.json({ message: "Data received and processed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
app.post("/api/endpoint", getUsername);
app.get("/api/data", (req, res) => {
  res.json(savedData);
});
app.listen(process.env.PORT, () => {
  console.log("Server Up and Running");
});
