require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const passport = require('passport');
const MongoStore = require('connect-mongo');


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Server is connected!'))
    .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SEC,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false, maxAge: 180 * 60 * 1000},
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_SESS_URI
    })
}));
app.use(passport.authenticate('session'));

app.use('/api/auth', authRoute);
app.use('/api/product', productRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("backend running");
});

