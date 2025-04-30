
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    let check = false;
    for(let i=0; i < users.length; i++){
        if(users[i].username = username){
            check = true;
        }
    }
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!check) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

//List of all books with Promises

const getBooks = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};


public_users.get('/',async function (req, res) {
  try {
    const bookList = await getBooks(); 
    res.json(bookList); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Couldnt get booklist" });
  }
});

//Books from isbn with Promises
const getIsbn = (isbn) => {
            return new Promise((resolve, reject) => {
            let isb = parseInt(isbn);
            if (books[isb]) {
                resolve(books[isb]);
            } else {
                reject({ status: 404, message: `Book ${isbn} not found` });
            }
        });
    };

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    getIsbn(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filterbooks = [];

    for (let index = 1;index < 11; index ++) {
        if (books[index].author === author){
            filterbooks.push(books[index]);
        }
    }
    res.send(filterbooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filterbooks = [];

    for (let index = 1;index < 11; index ++) {
        if (books[index].title === title){
            filterbooks.push(books[index]);
        }
    }
    res.send(filterbooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send('The book '+books[isbn].title+' has a review of ' + JSON.stringify(books[isbn].reviews,null,4));
});

module.exports.general = public_users;
