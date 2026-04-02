const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(u => u.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(u => u.username === username && u.password === password);
}

// Task 7: Register
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(201).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(400).json({message: "User already exists!"});
        }
    }
    return res.status(400).json({message: "Unable to register user."});
});

// Task 8: Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({message: "Invalid Login. Check username and password"});
    }
});

// Task 9: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({message: "The review for the book with ISBN " + isbn + " has been added/updated."});
    }
    return res.status(404).json({message: "Book not found"});
});

// Task 10: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: "Review for ISBN " + isbn + " deleted successfully"});
    }
    return res.status(404).json({message: "Review not found for this user"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;