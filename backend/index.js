require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const jsdom = require("jsdom");
const HTMLTableToJson = require("html-table-to-json");
const puppeteer = require("puppeteer");
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
  return HTMLTableToJson.parse(table).results;
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
function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}
const getDataFromQuicklrn = async (req, res) => {
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
const getDataFromAcadmia = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Both email and password are required." });
  }
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try {
    await page.goto("https://academia.srmist.edu.in");

    // Switch to the iframe
    await page.waitForSelector("iframe");
    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();

    // Email Element
    const emailInputSelector = "input#login_id";
    await frame.waitForSelector(emailInputSelector);
    await frame.type(emailInputSelector, email);

    // Next Button Element
    const nextButtonSelector = "button#nextbtn";
    await frame.waitForSelector(nextButtonSelector);
    const nextButtonElement = await frame.$(nextButtonSelector);
    await nextButtonElement.click();

    // Password Element
    const passwordInputSelector = "input#password";
    await frame.waitForSelector(passwordInputSelector, {
      visible: true,
      timeout: 10000,
    });
    await frame.focus(passwordInputSelector); // Ensure focus
    await frame.type(passwordInputSelector, password);

    // Sign In Button Element
    const signInButtonSelector = "button#nextbtn";
    await frame.waitForSelector(signInButtonSelector);
    const signInButtonElement = await frame.$(signInButtonSelector);
    await signInButtonElement.click();
    // Waiting for Navigation
    await page.waitForNavigation();
    //My attendance Page
    await page.goto("https://academia.srmist.edu.in/#Page:My_Attendance");

    const tableXPath =
      '//*[@id="zc-viewcontainer_My_Attendance"]/div/div[4]/div/table[3]';
    await page.waitForXPath(tableXPath);

    const [tableElement] = await page.$x(tableXPath);
    const tableContent = await page.evaluate((table) => {
      return table.outerHTML;
    }, tableElement);

    const jsonTables = HTMLTableToJson.parse(tableContent);
    const tableData = jsonTables.results[0];
    const updatedData = tableData.map(entry =>
      renameKeys(entry, {
        "Course Title": "Title",
        "Hours Conducted": "Conducted",
        "Hours Absent": "Absent",
        "Attn %": "Attn"
      })
    );
    res.json(updatedData);
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred during the login process." });
  } finally {
    await browser.close();
  }
};
app.post("/api/quicklrn", getDataFromQuicklrn);
app.post("/api/acadmia", getDataFromAcadmia);
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
