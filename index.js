const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const path = require("path");
const { type } = require("os");

const port = 3000;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/interviewlistDB", {
    useNewUrlParser: true,
});

const interviewSchema = new mongoose.Schema({
    stime: String,
    etime: String,
    participants: Array,
});

const profileSchema = new mongoose.Schema({
    stime: String,
    etime: String,
    name: String
})

const Interview = new mongoose.model("Interview", interviewSchema);

const arrayNames = [
    "Jainendra",
    "Amit",
    "Nandini",
    "Swarup",
    "Ishu",
    "Shubhi",
    "Haripriya",
    "Meena",
    "Saket",
    "Aditya",
    "Satyam"
];

const selectNames = [];

const flag = false;

app.post("/", (req, res) => {
    selectNames.push(req.body.snames);
    const stime = req.body.start;
    const etime = req.body.end;

    Interview.find({}, (err, foundItem) => {
        if (err) {
            console.log(err);
        }
        foundItem.map((item) => {
            let foundList = [];
            let arrNames = [];
            if (item.stime <= stime && item.etime >= stime || item.stime <= etime && item.etime >= etime) {
                foundList = (item.participants);
                arrNames = selectNames[0];
                const found = foundList.some(elem => arrNames.includes(elem));

                if (found) {
                    console.log("Foundlist  " + foundList);
                    console.log("Arrnames  " + arrNames);
                }
            }
        })
    });




    if (selectNames.length >= 2 && stime < etime) {
        const newInterview = new Interview({
            stime: req.body.start,
            etime: req.body.end,
            participants: req.body.snames,
        });

        newInterview.save((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Saved!");

                Interview.find({}, (err, foundItem) => {
                    if (err) {
                        console.log(err);
                    }
                    res.render("home", {
                        list: foundItem,
                        names: arrayNames,
                        flagitem: flag ? "" : "Enter more than 2",
                    });

                });
            }
        });
        // flag = true;
    } else {
        console.log("Seclect more than 2 or enter valid time");
    }
});

app.get("/", function (req, res) {
    Interview.find({}, (err, foundItem) => {
        if (err) {
            console.log(err);
        }
        res.render("home", {
            list: foundItem,
            names: arrayNames,
            flagitem: flag ? "" : "Enter more than 2",
        });
    });
});

app.listen(port, function (err) {
    if (err) {
        console.log("Error in opening sever");
    }
    console.log("server is serving");
});