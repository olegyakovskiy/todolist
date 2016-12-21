var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();

app.use(cors());
app.use(bodyParser());

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/librarian');


var Book = mongoose.model('Book', {name: String});

app.get("/", function (req, res) {
    Book.find(function (err, books) {
        res.send(books);
    })
});

app.post("/add", function (req, res) {
    var name = req.body.name;
    var book = new Book({name:name});
    book.save(function (err) {
        res.send();
    })
});

app.post("/remove", function (req, res) {
    var bookId = req.body.bookId;
    Book.find({_id:bookId}, function (err, books) {
        // TODO: validate non 1 array size
        var book = books[0];
        book.remove(function () {
            res.send();
        });

    });
});

app.listen(3000);