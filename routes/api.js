/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const { json } = require("body-parser");
const Book = require("../Models/Books");
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find()
        .then((books) => {
          res.json(
            books.map((book) => {
              return {
                _id: book._id,
                title: book.title,
                commentcount: book.comments.length,
              };
            })
          );
        })
        .catch((err) => {
          res.status(400).json({ error: "could not fetch books" });
        });
    })

    .post(function (req, res) {
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.status(400).json({ error: "book title is required" });
      } else {
        const newBook = new Book({ title });
        newBook
          .save()
          .then((book) => {
            res.json(book);
          })
          .catch((err) => {
            res.status(400).json({ error: "could not post book" });
          });
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({})
        .then((result) => {
          if (result.nDeleted > 1) {
            res.json({ success: "complete delete successful" });
          } else {
            res.json({ warning: "nothing deleted" });
          }
        })
        .catch((err) => {
          res
            .status(400)
            .json({ error: "error encountered while deleteing books" });
        });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid)
        .then((book) => {
          res.json(book);
        })
        .catch((err) => {
          res.status(400).json({ error: `no book exists` });
        });
    })

    .post(function (req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findById({ _id: bookid })
        .then((book) => {
          // res.json(updatedBook);
          book.comments.push(comment);
          book
            .save()
            .then((updatedBook) => {
              res.json(updatedBook);
            })
            .catch((err) => {
              res.status(400).json({ error: "could not post comment" });
            });
        })
        .catch((err) => {
          res.status(400).json({ error: "could not post comment" });
        });
    })

    .delete(function (req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({ _id: bookid })
        .then((result) => {
          if (result.nDeleted > 0) {
            res.json({ success: "delete successful" });
          } else {
            res.json({ warning: "nothing deleted" });
          }
        })
        .catch((err) => {
          res
            .status(400)
            .json({ error: `could not delete book with id ${bookid}` });
        });
    });
};
