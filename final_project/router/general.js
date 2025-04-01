const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   res.send(JSON.stringify(books, null, 4));
// });

const axios = require('axios');

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Since the data is local, no need to await anything; simply return it
    // const response = await axios.get('https://something.com/books'); //=> if there were an api url...
    // res.send(JSON.stringify(response.data, null, 4));  // Assuming response.data contains the list of books...
    res.send(JSON.stringify(books, null, 4)); // => because there isnt a url, implementing axios makes no sense!
  } catch (error) {
    res.status(500).send('Error fetching book list: ' + error.message);
  }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
// });

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Return a Promise that resolves with the book details
  new Promise((resolve, reject) => {
    const book = books[isbn];

    if (book) {
      resolve(book);  // If book is found, resolve the promise with the book details
    } else {
      reject('Book not found');  // If book is not found, reject the promise with an error message
    }
  })
    .then(book => {
      res.send(JSON.stringify(book, null, 4));  // Send the book details as a JSON response
    })
    .catch(error => {
      res.status(404).send(error);  // Send error message if the book is not found
    });
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const authorParam = req.params.author.toLowerCase(); // normalize for case-insensitive match
//   const matchingBooks = [];

//   for (const isbn in books) {
//     const book = books[isbn];
//     if (book.author.toLowerCase() === authorParam) {
//       matchingBooks.push({ isbn, ...book });
//     }
//   }

//   if (matchingBooks.length > 0) {
//     res.status(200).json({ books: matchingBooks });
//   } else {
//     res.status(404).json({ message: "No books found by that author." });
//   }
// });

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const authorParam = req.params.author.toLowerCase(); // Normalize for case-insensitive match

  // Return a Promise that resolves with the list of matching books
  new Promise((resolve, reject) => {
    const matchingBooks = [];

    for (const isbn in books) {
      const book = books[isbn];
      if (book.author.toLowerCase() === authorParam) {
        matchingBooks.push({ isbn, ...book });
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);  // Resolve the promise with the matching books
    } else {
      reject('No books found by that author');  // Reject if no books are found
    }
  })
    .then(matchingBooks => {
      res.status(200).json({ books: matchingBooks });  // Send the matching books as a JSON response
    })
    .catch(error => {
      res.status(404).json({ message: error });  // Send an error message if no books are found
    });
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const titleParam = req.params.title.toLowerCase(); // normalize for case-insensitive match
//   const matchingBooks = [];

//   for (const isbn in books) {
//     const book = books[isbn];
//     if (book.title.toLowerCase() === titleParam) {
//       matchingBooks.push({ isbn, ...book });
//     }
//   }

//   if (matchingBooks.length > 0) {
//     res.status(200).json({ books: matchingBooks });
//   } else {
//     res.status(404).json({ message: "No books found by that title." });
//   }
// });

// Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const titleParam = req.params.title.toLowerCase(); // Normalize for case-insensitive match

  // Return a Promise that resolves with the list of matching books
  new Promise((resolve, reject) => {
    const matchingBooks = [];

    for (const isbn in books) {
      const book = books[isbn];
      if (book.title.toLowerCase().includes(titleParam)) {  // Use includes for partial matching
        matchingBooks.push({ isbn, ...book });
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);  // Resolve the promise with the matching books
    } else {
      reject('No books found by that title');  // Reject if no books are found
    }
  })
    .then(matchingBooks => {
      res.status(200).json({ books: matchingBooks });  // Send the matching books as a JSON response
    })
    .catch(error => {
      res.status(404).json({ message: error });  // Send an error message if no books are found
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
