const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');
const CryptoJS = require('crypto-js');
require('dotenv').config({path: 'backend/.env'});


router.post('/signup', async (req, res) => {
    try {
        const email = await User.findOne({email: req.body.email});
        if (email) {
            res.status(500).json("Email đăng ký đã tồn tại")
        } 
        else {
            let name;
            if (req.body.name) name = req.body.name;
            else name = req.body.username;
            const newUser = new User({
                username: req.body.username,
                password: CryptoJS.AES.encrypt(
                    req.body.password,
                    process.env.PASS_SEC
                ).toString(),
                email: req.body.email,
                name: name,
            });
            const createdUser = await newUser.save();
            res.status(200).json(createdUser);
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;