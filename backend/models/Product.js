const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        img: {type: String},
        supplier: {type: String, default: "Sản phẩm không rõ nhà cung cấp"},
        author: {type: String, default: "Sản phẩm không rõ tác giả"},
        price: {type: Number, required: true},
        onStock: {type: Boolean, default: true},
        category: {type: Array},
        desc: {type: String},
    },
    {timestamps: true}
);

module.exports = mongoose.model('Product', productSchema);