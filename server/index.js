const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/frog');
const croaks = db.get('croaks');
const filter = new Filter();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'croak! 🐸🐸'
    })
});

app.get('/croaks', (req, res) => {
    croaks.find()
        .then(croaks => {
            res.json(croaks);
        })
});

function isValidCroak(croak) {
    return croak.name && croak.name.toString().trim() !== '' &&
        croak.content && croak.content.toString().trim() !== '';
}

// app.use(rateLimit({
//     windowMs: 30 * 1000, //30 seconds
//     max: 1
// }));

app.post('/croaks', (req, res) => {
    if (isValidCroak(req.body)) {
        const croak = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        croaks.insert(croak).then(createdCroak => {
            res.json(createdCroak);
        });

    } else {
        res.status(422);
        res.json({
            message: "Hey, Name and Content are required!"
        });
    }
});

app.listen(5000, () => {
    console.log('listening on "http://localhost:5000');
});