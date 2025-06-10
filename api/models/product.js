const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    productImage:{type: String}
})


module.exports = mongoose.model('Product',productSchema)