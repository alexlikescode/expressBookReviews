const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    if(username){return true;}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    for(let i=0; i < users.length; i++){
        if((users[i].username = username) && (users[i].password = password)){
            console.log("hi" + users[i].username);
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;  
  
  if (!(authenticatedUser(username,password))){
       return res.status(404).json({ message: "Invalid Cridentials" });
  }
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: username
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.username;
  
  let review = req.query.review;
  console.log(username,review);
  //let rev = {user:userd,review:details}
  
  //const user = req.body.username;
  const userRating = {
                    "User" : username,
                    "Rating"  : review
                }
  for(let i=0; i < books[isbn].review.length; i++){
        if(books[isbn].review[i].User = username){
            books[isbn].review[i].Rating = review;
            return res.status(201).json({message:"Review edited successfully"})
 
        }
    }

   books[isbn].rating.push(userRating);
   return res.status(201).json({message:"Review added successfully"})
 });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
