let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let path = require('path');
require('dotenv').config();

let userRouter = require('./routes/userRoutes');
let webhookAuthRouter = require('./routes/webhookAuthRouter');
let newsRouter = require('./routes/newsRoutes');

let app = express();

app.use(cors());

// user creation route
app.use('/api/user', userRouter);

// stripe webhooks route
app.use('/webhook/auth', webhookAuthRouter);

// news data routes
app.use('/api/news', newsRouter);


app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
    res.sendFile(
        path.join(__dirname, "./client/build/index.html"),
        function (err) {
            res.status(500).send(err);
        }
    );
});

mongoose.connect(process.env.mongoURI)
    .then(() => {
        app.listen(process.env.serverURL, (err) => {
            if (err) console.log('listen error:\n', err);
            console.log('connection to db established. listening to requests');
        });
    })
    .catch(err => {
        console.log('can not connect to db. error: \n', err.message);
    })
