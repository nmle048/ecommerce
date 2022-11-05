const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');
const Product = require('../models/Product');
const CryptoJS = require('crypto-js');
require('dotenv').config({path: 'backend/.env'});

//CREATE PRODUCT
router.post('/', async (req, res) => {
    const userId = req.session.userId;
    const newProduct = new Product(req.body);
    try {
        const user = await User.findById(userId);
        if (!user.isAdmin) res.status(500).json('Tài khoản của bạn không có quyền tạo sản phẩm');
        else {
            const product = await Product.findOne({name: req.body.name});
            if (product) res.status(500).json('Sản phẩm đã có tại hệ thống');
            else {
                const createdProduct = await newProduct.save();
                res.status(200).json(createdProduct);
            }
        }
    } 
    catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) res.status(500).json('Không tìm thấy sản phẩm');
        else {
            res.status(200).json(product);
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
});

//GET ALL PRODUCT
router.get('/', async (req, res) => {
    const qNew = req.params.new;
    const qCategory = req.params.category;
    try {
        let product;
        if (qNew) {
            product = await Product.find().sort({createdAt: -1});
        }
        else if (qCategory) {
            product = await Product.find({
                category: {
                    $in: [qCategory]
                }
            });
        }
        else {
            product = await Product.find();
        }
        res.status(200).json(product);
    }
    catch(err) {
        res.status(500).json(err);
    }
});

//UPDATE PRODUCT
router.put('/:productId', async (req, res) => {
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);
        if (!user.isAdmin) res.status(500).json('Tài khoản của bạn không có quyền sửa sản phẩm');
        else {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.productId,
                {
                    $set: req.body
                },
                {new: true}
            );
            res.status(200).json(updatedProduct);
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
});

//DELETE PRODUCT
router.delete('/:productId', async (req, res) => {
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);
        if (!user.isAdmin) res.status(500).json('Tài khoản của bạn không có quyền xóa sản phẩm');
        else {
            await Product.findByIdAndDelete(req.params.productId);
            res.status(200).json('Sản phẩm đã được xóa');
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;