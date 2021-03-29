//dependencies
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;


const app = express();
//middleware
app.use(cors());
app.use(express.json());


const uri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykse1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
    console.log('Errors found: ', err);
    
    const eventsCollection = client.db(process.env.DB_NAME).collection("events");
    console.log('Database connected!');

    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        console.log(newEvent);
        eventsCollection.insertOne(newEvent)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/events', (req, res) => {
        eventsCollection.find({})
        .toArray( (err, events) => {
            res.send(events);
        })
    })
    
});


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
