var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();

app.use(cors());
app.use(bodyParser());

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/librarian');


var Task = mongoose.model('Task', {name: String});

app.get("/", function (req, res) {
    Task.find(function (err, tasks) {
        res.send(tasks);
    })
});

app.post("/add", function (req, res) {
    var name = req.body.name;
    var task = new Task({name:name});
    task.save(function (err) {
        res.send();
    })
});

app.post("/remove", function (req, res) {
    var taskIdId = req.body.taskId;
    Task.find({_id:taskIdId}, function (err, tasks) {
        // TODO: validate non 1 array size
        var task = tasks[0];
        task.remove(function () {
            res.send();
        });

    });
});

app.listen(3000);