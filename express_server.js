const express = require("express");
const app = express();
app.set("view engine", "ejs");
var crypto = require("crypto");
const PORT = 8082; // default port 8082
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//server listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
return crypto.randomBytes(3).toString('hex');
//console.log('newId :>> ', newId);
}


//sample DAtabase
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "whatthe": "www.gamefacephtoo.ca"
};

app.get("/", (req, res) => {
  res.send("Hello Justin's World !");
});


app.get("/urls", (req, res) => {
  const myData = { urls: urlDatabase };
  res.render('urls_index', myData)
});

app.get("/urls/new", (req, res) => {
  res.render('urls_new')
}); 

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/redirect/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/url/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl
  console.log('res.redirect(urlDatabase[shortUrl]) :>> ', res.redirect(urlDatabase[shortUrl]));
res.redirect(urlDatabase[shortUrl])
});

app.post("/urls", (req, res) => {
  const newId  =  generateRandomString();
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[newId] = req.body.longURL
  res.redirect('/urls');
});


// app.post('/cars/:car_id', (req, res) => {
//   const carId = req.params.car_id;
//   const newColor = req.body.color;
//   cars[carId].color = newColor;
//   res.redirect('/cars');
// });