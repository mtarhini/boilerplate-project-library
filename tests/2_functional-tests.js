/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);
var idToBeUsedInTest;
suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "My first posted book" })
            .end(function (err, res) {
              assert.equal(res.status, 200);

              assert.property(
                res.body,
                "title",
                "The returned book should have a title"
              );
              assert.property(
                res.body,
                "_id",
                "The returned book should have an id"
              );
              assert.property(
                res.body,
                "comments",
                "The returned book should have an empty array of comments"
              );
              assert.equal(res.body.title, "My first posted book");
              idToBeUsedInTest = res.body._id;
              done();
            });
        });

        test("Test POST /api/books with no title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .end(function (err, res) {
              assert.equal(res.status, 400);
              assert.equal(res.body.error, "book title is required");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/123")
          .end(function (err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, "no book exists");

            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${idToBeUsedInTest}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);

            assert.equal(res.body._id, idToBeUsedInTest);

            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post(`/api/books/${idToBeUsedInTest}`)
            .send({ comment: "My first comment" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, idToBeUsedInTest);
              assert.isArray(
                res.body.comments,
                "returned book should have an array of comments"
              );
              assert.equal(res.body.comments[0], "My first comment");
              done();
            });
        });
      }
    );
  });
});
