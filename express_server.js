const express = require("express");
const app = express();
app.set("view engine", "ejs")
const PORT = 8082; // default port 8082

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "whatthe": "www.gamefacephtoo.ca"
};
const greeting = {
  "german": "Gooden Morgan",
};

app.get("/", (req, res) => {
  res.send("Hello Justin's World !");
});

app.get("/urls", (req, res) => {
  const myData = { urls: urlDatabase };
  res.render('urls_index', myData)
});

app.get("/greeting", (req, res) => {
  const myData = { greeting: greeting };
  console.log('greeting :>> ', greeting);
  res.render('greeting', myData)
}); 


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });
 