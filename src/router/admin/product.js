const express = require('express');
const router = express.Router();
const adminProduct = require('../../adminCtrl/admin_Product/adminCtrlProduct');
const verifyToken = require('../../controller/tokenhandle/verifyToken');
const authorizeRole = require('../../middleware/authorizeRole');


router.post('/products', verifyToken, authorizeRole(1,2,4), adminProduct.getAllProductsCtrl);
router.post('/products/create', verifyToken, authorizeRole(1,2,4), adminProduct.createProductCtrl);
router.put('/products/:id', verifyToken, authorizeRole(1,2,4), adminProduct.updateProductCtrl);
router.delete('/products/:id', verifyToken, authorizeRole(1,2,4), adminProduct.deleteProductCtrl);
router.get('/products/search', verifyToken, authorizeRole(1,2,4), adminProduct.searchProductsByNameCtrl);
router.get('/products/searchByPrice', verifyToken, authorizeRole(1,2,4), adminProduct.searchProductsByPriceRangeCtrl);
router.get('/product-types', verifyToken, authorizeRole(1,2,4), adminProduct.getAllProductTypesCtrl);


// TODO: Add route for search by product type

module.exports = router;