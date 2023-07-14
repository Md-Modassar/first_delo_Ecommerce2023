const express=require('express')
const { requireSignIn, isAddmin } = require('../middelware/authmiddelware')
const { createProductController, getproduct, getsingalproduct, productPhotocantroller, deleteProduct, updateProductController, productFilterControler, productCountController, productListController, searchproductCantroller, reactedproductController, productCategoryController, braintreeTokenController, brainTreePaymentContoller } = require('../controllers/productCantroller')
const router=express.Router()
const formidable=require('express-formidable')
 
router.post('/create-product',requireSignIn,isAddmin,formidable(),createProductController)
router.get('/get-product',getproduct)
router.get('/get-product/:slug',getsingalproduct)
router.get('/product-photo/:pid',productPhotocantroller)
router.delete('/delete-product/:pid',deleteProduct)
router.put('/update-product/:pid',requireSignIn,isAddmin,formidable(),updateProductController)

router.post('/product-filters',productFilterControler)

router.get('/product-count',productCountController)

router.get('/product-list/:page',productListController)

router.get('/search/:keyword',searchproductCantroller)

router.get('/related-product/:pid/:cid',reactedproductController)

router.get('/product-category/:slug',productCategoryController)

//payments routes
//token

router.get('/braintree/token',braintreeTokenController)

router.post('/braintree/payment',requireSignIn,brainTreePaymentContoller)



module.exports=router


