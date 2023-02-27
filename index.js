require('dotenv').config()
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


let flag = 0; 

app.post("/", (req, res) => {
    let selectNames = req.body.snames;
    const stime = req.body.start;
    const etime = req.body.end;

    if (typeof selectNames === 'string') {
        selectNames = [selectNames];
    }
    if(selectNames.length <= 1)
    {
        console.log("Select more students");
        return res.redirect("/");
    }

    Interview.find({}, (err, foundItem) => {
        if (err) {
            console.log(err);
        }
        foundItem.map((item) => {
            let foundList = [];
            let arrNames = [];

            if (item.stime <= stime && item.etime >= stime || item.stime <= etime && item.etime >= etime) {
                foundList = (item.participants);
                arrNames = selectNames;
                const found = foundList.some(elem => arrNames.includes(elem));
                if (found) {
                    flag = 1;
                }
            }
        })
        console.log(flag);
        if (flag === 0) {
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
                            return res.render("home", {
                                list: foundItem,
                                names: arrayNames,
                                flagitem: flag ? "" : "Enter more than 2",
                            });
    
                        });
                    }
                });
            } 
            else {
                console.log("Enter more than 2 names or start time is greater than end time");
                return res.redirect("/");
            }
        } else {
            console.log("Participant not available");
            return res.redirect("/");
        }
    });
});

app.post("/delete", (req,res) =>{
    const Dstudent = req.body.Student;
    return res.redirect("/");
})

// app.post("/", (req, res) => {
//     let selectNames = req.body.snames;
//     const stime = req.body.start;
//     const etime = req.body.end;

//     // If selectNames is a string, create an array with a single element containing the name entered
//     if (typeof selectNames === 'string') {
//         selectNames = [selectNames];
//     }

//     // Reset flag to 0
//     // flag = 0;

//     Interview.find({}, (err, foundItem) => {
//         if (err) {
//             console.log(err);
//         }
//         foundItem.map((item) => {
//             let foundList = [];
//             let arrNames = [];

//             if (item.stime <= stime && item.etime >= stime || item.stime <= etime && item.etime >= etime) {
//                 foundList = (item.participants);
//                 arrNames = selectNames;
//                 console.log(arrNames);
//                 const found = foundList.some(elem => arrNames.includes(elem));
//                 console.log(found);
//                 if (found) {
//                     flag = 1;
//                 }
//             }
//         })
//     });

//     if (flag === 0) {
//         if (selectNames.length >= 2 && stime < etime) {
//             const newInterview = new Interview({
//                 stime: req.body.start,
//                 etime: req.body.end,
//                 participants: req.body.snames,
//             });
//             newInterview.save((err) => {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log("Saved!");

//                     Interview.find({}, (err, foundItem) => {
//                         if (err) {
//                             console.log(err);
//                         }
//                         res.render("home", {
//                             list: foundItem,
//                             names: arrayNames,
//                             flagitem: flag ? "" : "Enter more than 2",
//                         });

//                     });
//                 }
//             });
//         } else {
//             console.log("Enter more than 2 names or start time is greater than end time");
//             return res.redirect('/');

//         }
//     } else {
//         console.log("Participant not available");
//         return res.redirect('/');
//     }
// });

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

app.listen(process.env.PORT || port, function (err) {
    if (err) {
        console.log("Error in opening sever");
    }
    console.log("server is serving");
});