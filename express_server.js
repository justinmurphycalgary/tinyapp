const express = require("express");
const app = express();
app.set("view engine", "ejs");
var crypto = require("crypto");
const PORT = 8082; // default port 8082
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

//server listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//generate user ID
function generateRandomString() {
  return crypto.randomBytes(3).toString("hex");
  console.log("newId created :>> ", newId);
}

//sample DAtabase
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  edrftg: "www.gamefacephtoo.ca",
};
let userName = "";

app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    userName: req.cookies["userName"],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  // const myData = { urls: urlDatabase };
  const templateVars = {
    urls: urlDatabase,
    userName: req.cookies["userName"],
    // ... any other vars
  };
  res.render("urls_index", templateVars);
  //res.render('urls_index', myData)
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    userName: req.cookies["userName"],
    // ... any other vars
  };
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/details/:shortURL", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    userName: req.cookies["userName"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    // ... any other vars
  };
  res.render("urls_show", templateVars);
});

app.get("/redirect/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;
  console.log(
    "res.redirect(urlDatabase[shortUrl]) :>> ",
    res.redirect(urlDatabase[shortUrl])
  );
  res.redirect(urlDatabase[shortUrl]);
});
// create a new database entry
app.post("/newUrl", (req, res) => {
  const newId = generateRandomString();
  console.log(req.body); // Log the POST request body to the console
  urlDatabase[newId] = req.body.longURL;
  res.redirect(`/details/${newId}`);
});

//redirect to longurl
app.get("/u/:shortUrl", (req, res) => {
  res.redirect(urlDatabase[req.params.shortUrl]);
});

//press delete button
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls/`);
});

//edit long url
app.post("/urls/:shortURL/update", (req, res) => {
  console.log(req.body);
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/details/${req.params.shortURL}`);
});
//login
app.post("/login", (req, res) => {
  console.log(req.body.userName);
  res.cookie("userName", req.body.userName);
  userName = req.body.userName;
  console.log("userName :>> ", userName);
  res.redirect(`/urls/`);
});
