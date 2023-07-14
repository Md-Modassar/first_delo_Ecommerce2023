const express=require('express')
const router=express.Router();
const {registercontroller,logincantroller,testcantroller, forgotPasswordController, updateProfileCaontroller, getOrdersController, getAllOrdersController, orderStatusController}=require('../controllers/authcontroller')
const {requireSignIn, isAddmin}=require('../middelware/authmiddelware')




router.post('/register',registercontroller)
router.post('/login',logincantroller)
router.post('/forgot-password',forgotPasswordController)
router.get('/test',requireSignIn,isAddmin,testcantroller)

router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})
router.get('/admin-auth',requireSignIn,isAddmin,(req,res)=>{
    res.status(200).send({ok:true})
})

//update profile
 router.put('/profile',requireSignIn,updateProfileCaontroller)

 router.get('/orders',requireSignIn,getOrdersController)

 router.get('/all-orders',requireSignIn,isAddmin,getAllOrdersController)

 router.put('/order-status/:orderId',requireSignIn,isAddmin,orderStatusController)

module.exports=router