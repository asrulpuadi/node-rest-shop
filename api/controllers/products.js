const mongoose = require('mongoose')
const Product = require('../models/product')

exports.products_get_all = (req,res,next) => {
    Product.find()
    .select('_id name price productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request:{
                        type: 'GET',
                        url: 'http://127.0.0.1:3000/products/'+ doc._id
                    }
                }
            })
        }

        console.log(docs);

        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    })
}

exports.products_created_product = (req,res,next) => {
    console.log(req.file);
    
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    product.save()
    .then((result)=>{
        console.log(result)

        res.status(201).json({
            message: 'Created product successfully',
            createdProduct:{
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: 'http://127.0.0.1:3000/products/'+ result._id
                }
            }
        })
    })
    .catch(err => {
        console.log(err)

        res.status(500).json({
            error: err
        })
    })
}

exports.products_get_product = (req,res,next) => {
    const id = req.params.productId

    Product.findById(id)
    .select('_id name price productImage')
    .exec()
    .then(doc => {
        console.log("From database ",doc);

        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://127.0.0.1:3000/products/'
                }
            })
        }else{
            res.status(404).json({
                message: "No valid entry found for provided ID"
            })
        }        
    })
    .catch(err => {
        console.log(err)

        res.status(500).json({error: err})
    })
}

exports.products_update_product = (req,res,next) => {
    const id = req.params.productId
    const updateOps = {}

    Product.findByIdAndUpdate(id,{$set: req.body},{ new: true })
    .exec()
    .then(result => {
        console.log(result);

        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    }) 
}

exports.products_delete_product = (req,res,next) => {
    const id = req.params.productId

    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    })
}
