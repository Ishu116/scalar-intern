const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const path = require('path');
const { type } = require('os');


const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect('mongodb://127.0.0.1:27017/interviewlistDB', { useNewUrlParser: true });

const interviewSchema = new mongoose.Schema({
    stime: String,
    etime: String,
    participants: String
});

const Interview = new mongoose.model("Interview", interviewSchema);

const arrayNames = ["Jainendra", "Amit", "Nandini", "Swarup"];




app.post('/', (req, res) => {
    const newInterview = new Interview({
        stime: req.body.start,
        etime: req.body.end,
        participants: String(req.body.cars)
    });
    
    newInterview.save((err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Saved!");
        }
        
    })
    
    console.log(String(req.body.cars));
})

app.get('/', function (req, res) {
    Interview.find({},(err, foundItem)=>{
        console.log(err);
        res.render('home', { list: foundItem });
    })
})





app.listen(port, function (err) {
    if (err) {
        console.log('Error in opening sever');
    }
    console.log('server is serving');
})