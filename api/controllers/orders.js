const Order = require('../models/order')
const Product = require('../models/product')
const mongoose = require('mongoose')

exports.orders_get_all = (req,res,next) => {
    Order.find()
    .select('_id product quantity')
    .populate('product','name')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request:{
                        type: 'GET',
                        url: 'http://127.0.0.1:3000/orders/'+ doc._id
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

exports.orders_created_order = (req,res,next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        })

        return order.save()
    })
    .then(result => {
        console.log(result);

        res.status(201).json({
            message:'order was created',
            order: result
        })
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    })
}

exports.orders_get_order = (req,res,next) => {
    const id = req.params.orderId
    
    Order.findById(id)
    .select('_id product quantity')
    .populate('product')
    .exec()
    .then(doc => {
        console.log("From database ",doc);

        if (doc) {
            res.status(200).json({
                order: doc,
                request: {
                    type: 'GET',
                    description: 'Get all orders',
                    url: 'http://127.0.0.1:3000/orders/'
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

exports.orders_delete_order = (req,res,next) => {
    const id = req.params.orderId
    
    Order.deleteOne({_id: id})
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