const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users')

mongoose.connect('mongodb://localhost:27017/rest_shop')
.then(() => console.log("Connected to local mongodb successfully"))
.catch((error) => console.log("Error connected to lmongodb : ",error))

mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization")
    
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }

    next()
})

app.use('/products',productRoutes)
app.use('/orders',orderRoutes)
app.use('/users', userRoutes)

app.use((req,res,next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})

app.use((error,req,res,next) => {
    res.status(error.status || 500)
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app


