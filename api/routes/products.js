const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const checkAuth = require('../middleware/check-auth')

const ProductsController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, path.join(__dirname, "../../uploads"));
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const upload = multer({
    storage: storage,
     limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', ProductsController.products_get_all)

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_created_product)

router.get('/:productId', ProductsController.products_get_product)

router.patch('/:productId', checkAuth, ProductsController.products_update_product)

router.delete('/:productId', checkAuth, ProductsController.products_delete_product)

module.exports = router