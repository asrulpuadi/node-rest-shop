const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(doc => {
        if (doc.length >= 1) {
            return res.status(409).json({
                message: 'Mail exists'
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })

                    user.save()
                    .then(result => {
                        console.log(result)

                        res.status(201).json({
                            message: 'User created successfull'
                        })
                    })
                    .catch(err => {
                        console.log(err);

                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
}

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }

            if (result) {
                const token =  jwt.sign(
                    {
                        email: user[0].email,
                        _id: user[0]._id
                    },
                    'secret',
                    { expiresIn: '1h' }
                )

                return res.status(200).json({
                    message: 'Auth successfull',
                    token: token
                })
            }

            res.status(401).json({
                message: 'Auth failed'
            })
        })
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    })
}

exports.user_delete = (req, res, next) => {
    const id = req.params.userId

    User.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    })
}