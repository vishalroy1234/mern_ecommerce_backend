const express = require('express')
const router = express.Router()
const {isAuthenticated, isAuthorized, isAdmin} = require('../controllers/auth')
const {getUserById} = require('../controllers/user')
const {getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories} = require('../controllers/product')

router.param('userId', getUserById)
router.param('productId', getProductById)

router.post('/product/create/:userId', isAuthorized, isAuthenticated, isAdmin, createProduct)
router.get('/product/:productId', getProduct)
router.get('/product/photo/:productId', photo)

router.delete('/product/:productId/:userId', isAuthorized, isAuthenticated, isAdmin, deleteProduct)
router.put('/product/:productId/:userId', isAuthorized, isAuthenticated, isAdmin, updateProduct)

//listing route
router.get('/products', getAllProducts)

router.get('/products/categories', getAllUniqueCategories)

module.exports = router