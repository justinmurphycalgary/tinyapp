const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const  crypto = require("crypto");
const PORT = 8082; // default port 8082
const app = express();

//sets view engine
app.set("view engine", "ejs");

//adds middleware into the express server
  //makes the cookie nito readable 
  app.use(cookieParser());

  //logs http request to the console
  app.use(morgan('dev'));

  //this parses the http body into variables "body"
  app.use(bodyParser.urlencoded({ extended: true }));

//server listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});  
      

// if (!email || !password){
//   res.status(400).send('email password cannot be blank')
// }

//generate user ID
function generateRandomString() {
  return crypto.randomBytes(3).toString("hex");
  console.log("newId created :>> ", newId);
}
  
//sample shortid Database
const urlDatabase = {
  just: {
    edrftg: "www.gamefacephtoo.ca"
  },
  Bob:  {
    b2xVn2: "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  }
};


//sample user DB
const users = { 
  just: {
    id: "just", 
    email: "just@example.com", 
    password: "pwd"
  },
 Bob: {
    id: "Bob", 
    email: "bob@bob.com", 
    password: "pwd"
  }
}
  

getUserIDByEmail = function(userEmail){
  //console.log('getUserIDByEmail email :>> ', userEmail);
  for (user of Object.values(users)){
    if (user.email == userEmail) {
      return user.id
    }}
}

getUrlsByUser = function(userEmail){
  const userID = getUserIDByEmail(userEmail)
  return urlDatabase[userID]
}

//let user_id = "";
//check if userid exists
userIdExistCheck = function(req, res){
  const inputEmail = req.body.email
  for (const userid in users){
    if (users[userid].email === inputEmail) {
      res.redirect(`/useralreadyexists/`)
    }}
    return true
};

authenticateUser = function(userId, password){
  console.log('<<: trying to authenticate :>> ');
  for (const userid in users){
    if (users[userid].email === userId && users[userid].password === password) {
      console.log('<<: Authenticated Sucessfully :>> ');
      return true
    }

  }
  return false
}

//check error status
errorcheck = function(){
  if (defaultError !== ""){
    app.get("/error", (req, res) => {
      const templateVars = {
        urls: urlDatabase,
        user_id: req.cookies["user_id"],
        err: "Default Error"
      };
      return res.render("urls_error", templateVars);
      defaultError = ""
    });
  }
}

//checklogin and redirect to registration page if 
checkloginStatus = function(req, res){
  if (!req.cookies.user_id){
    return res.render("user_new");
  }
  return false;
}  

//default page load
app.get("/", (req, res) => {
  //checkloginStatus(req, res)
  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies.user_id,
  };
  return res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  const userurlDatabase = getUrlsByUser(req.cookies["user_id"])
  const templateVars = {
    urls: userurlDatabase,
    user_id: req.cookies["user_id"],
  };
  return res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  //checkloginStatus(req, res)
  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"],
    // ... any other vars
  };
  return res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  
  res.json(urlDatabase);
});

app.get("/details/:shortURL", (req, res) => {
  checkloginStatus(req, res)
  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    // ... any other vars
  };
  return res.render("urls_show", templateVars);
});
  
app.get("/redirect/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;
  return res.redirect(urlDatabase[shortUrl]);
});


// create a new database entry
app.post("/newUrl", (req, res) => {
  const newId = generateRandomString();
  console.log(req.body); // Log the POST request body to the console
  const userID = getUserIDByEmail(req.cookies["user_id"])
  urlDatabase[userID][newId] = req.body.longURL

console.log('NEW urlDatabase :>> ', urlDatabase);
  return res.redirect(`/details/${newId}`);
});


  
//redirect to longurl destination address
app.get("/u/:shortUrl", (req, res) => {
  return res.redirect(urlDatabase[req.params.shortUrl]);
});
 
//register user
app.get("/registrationpage", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    // ... any other vars
  };
  return res.render("user_new", templateVars);
});

//register user
app.get("/useralreadyexists", (req, res) => {
  console.log('<<: DUPLICATE USER :>> ' );
  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    // ... any other vars
  };
  return res.render("useralreadyexists", templateVars);
});
  
    
//press delete button
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log('<<: URL DELETED :>> ' );
  const userID = getUserIDByEmail(req.cookies["user_id"])
  delete urlDatabase[userID][req.params.shortURL];
  return res.redirect(`/urls/`);
});    

//edit long url
app.post("/urls/:shortURL/update", (req, res) => {
  console.log('<<: URL UPDATED :>> ' );
  console.log(req.body)
  const userID = getUserIDByEmail(req.cookies["user_id"])
  urlDatabase[userID][req.params.shortURL] = req.body.longURL
  return res.redirect(`/details/${req.params.shortURL}`);
}); 

//user login
app.post("/userLogin", (req, res) => {
  console.log('<<: USER TRYING TO LOG IN :>> ' );
  console.log('req.body.email :>> ', req.body.email);
  console.log('req.body.password :>> ', req.body.password);
  console.log('CHECK :>> ', authenticateUser(req.body.email, req.body.password));
  if (authenticateUser(req.body.email, req.body.password) == true){
    res.cookie("user_id", req.body.email);
    return res.redirect(`/urls/`);
  }
  return res.status(400).send('Unauthorized user')
});
  
//logout procedure
app.post("/logout", (req, res) => {
  console.log('<<: USER LOGGED OUT :>> ' );
  console.log(`userID:..`,req.body.user_id);
  res.cookie("user_id", "");
  user_id = "";
  console.log("no user_id :>> ", user_id);
  return res.redirect(`/urls/`);
});


//userRegistration
app.post("/registeruser", (req, res) => {
  console.log('<<: USER REGISTERING :>> ' );
  if (!req.body.email|| !req.body.password){
    res.status(400).send('email password cannot be blank')
  }
  if (userIdExistCheck(req, res) == true){
    console.log('ID IS NEW :>> ');
   res.cookie("user_id", req.body.email);
   userid = generateRandomString()
   users[userid] = {
    id :  userid,
    email : req.body.email,
    password : req.body.password
   } 
   return res.redirect(`/urls/`);
  }
  return res.status(400).send('ID Already Exists')
  },

  
//userlogin
app.post("/loginpage", (req, res) => {
   return res.render(`user_login`);
   //console.log('users :>> ', users);
  },

)
);  
