const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: Get all books (Task 11: Using Promise)
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });
    getBooks.then((bookList) => {
        res.status(200).send(JSON.stringify(bookList, null, 4));
    });
});

// Task 11: Get book details based on ISBN (Using Promise)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({message: err}));
});

// Task 12: Get book details based on author (Using Promise)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    new Promise((resolve) => {
        let filtered = Object.values(books).filter(b => b.author === author);
        resolve(filtered);
    })
    .then(result => res.status(200).json(result));
});

// Task 13: Get all books based on title (Using Promise)
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    new Promise((resolve) => {
        let filtered = Object.values(books).filter(b => b.title === title);
        resolve(filtered);
    })
    .then(result => res.status(200).json(result));
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).json(books[isbn].reviews);
    } else {
        res.status(404).json({message: "No ISBN found"});
    }
});

module.exports.general = public_users;