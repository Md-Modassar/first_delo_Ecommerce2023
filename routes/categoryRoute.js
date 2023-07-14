const express=require('express')
const router=express.Router()
const { requireSignIn, isAddmin } = require('../middelware/authmiddelware')
const { createCategoryCantroller, updateCategoryController, categorycantroller, singalcategoryCantroller, deletecategorycantoller } = require('../controllers/categoryCantroller')


router.post('/create-category',requireSignIn,isAddmin,createCategoryCantroller)

router.put('/update-category/:id',requireSignIn,isAddmin,updateCategoryController)
router.get('/category',categorycantroller)
router.get('/singal-category/:slug',singalcategoryCantroller)
router.delete('/delete-category/:id',requireSignIn,isAddmin,deletecategorycantoller)

module.exports=router

