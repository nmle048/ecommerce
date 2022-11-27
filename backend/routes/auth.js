const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');
const CryptoJS = require('crypto-js');
require('dotenv').config({path: 'backend/.env'});

//PASSPORT CONFIGS
// passport.use(new LocalStrategy(verify = async (username, password, done) => {
//     const user = await User.findOne({username: username});
//     if (!user) return done(null, false, {message: 'Tên đăng nhập hoặc mật khẩu không đúng.'});

//     hashedPassword = CryptoJS.AES.decrypt(
//         password,
//         process.env.PASS_SEC
//     );
//     if (user.password != hashedPassword) return done(null, false, {message: 'Tên đăng nhập hoặc mật khẩu không đúng.'});
//     return done(null, user);
//     })
// );

// passport.serializeUser((user, done) => {
//     process.nextTick(() => {
//         return done(null, user._id);
//     });
// });
  
// passport.deserializeUser((id, done) => {
//     User.findOne({_id: id}, (err, user) => {
//         if (err) return done(null, err);
//         return done(null, user);
//     })
// });

// //SIGN IN
// router.post('/signin', passport.authenticate('local', {
//     successReturnToOrRedirect: '/',
//     failureRedirect: '/signin',
//     failureMessage: true
// }));

//SIGN IN GET
router.get('/signin', async (req, res) => {
    try {
        if (req.session.userId) {
            const userId = req.session.userId;
            const user = await User.findById(userId);
            if (!user) {
                req.session.destroy();
                res.status(500).json('Tài khoản không tồn tại.');
            }
            else {
                res.status(200).json(user.username);
            }
        }
        else res.status(500).json('Chưa đăng nhập.');
    }
    catch(err) {
        res.status(500).json(err);
    }
});

//SIGN IN POST
router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (!user) res.status(500).json('Tài khoản hoặc mật khẩu không đúng.');
        else {
            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            );
            if (hashedPassword.toString(CryptoJS.enc.Utf8) != req.body.password) res.status(500).json('Tài khoản hoặc mật khẩu không đúng.');
            else {
                req.session.userId = user._id;
                req.session.save();
                res.status(200).json('Đăng nhập thành công');
            }
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
});

//SIGN OUT
router.get('/signout', async (req, res) => {
    req.session.destroy();
    res.status(200).json('Bạn đã đăng xuất');
})

//SIGN UP
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