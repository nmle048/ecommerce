require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const authRoute = require('./routes/auth');


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Server is connected!'))
    .catch((err) => console.log(err));

app.use(cors());
app.use(session({
    secret: process.env.SESSION_SEC,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use(express.json());
app.use('/api', authRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("backend running");
});

