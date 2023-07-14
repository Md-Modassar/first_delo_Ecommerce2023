const { hashPassword,camparespassword } = require('../hlper/authhelper')
const usermodel=require('../models/usermodel')
const orderModel=require('../models/orderModel')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config();


exports.registercontroller=async(req,res)=>{
    try{
        const {name,email,password,phone,address,answer}=req.body
         if(!name)
           {
            return res.send({message:"Name is require"})
           }
           if(!email)
           {
            return res.send({message:"email is require"})
           }
           if(!password)
           {
            return res.send({message:"password is require"})
           }
           if(!phone)
           {
            return res.send({message:"phone is require"})
           }
           if(!address)
           {
            return res.send({message:"address is require"})
           }
           if(!answer)
           {
            return res.send({message:"address is require"})
           }

         const existuser =await usermodel.findOne({email})
         if(existuser)
           {
            return res.status(200).send({status:true,error:"this email already register"})
           }
       const password1=await hashPassword(password);
       const user=await usermodel({name,email,phone,address,password:password1,answer}).save()

       return res.status(201).send({success:true,message:"user register successfull",user})

    
    }catch(err){
        res.status(500).send({success:false,message:'some thing went wrong'})
    }
}

exports.logincantroller=async(req,res)=>{
   try{
      const {email,password}=req.body
      if(!email||!password)
        {
            return res.status(400).send("Please Enter email and password")
        }
       const user=await usermodel.findOne({email})
        if(!user)
          {
            return res.status(400).send({status:false,msg:"Please enter valid email"})
          }
        const match= await camparespassword(password,user.password)
       if(!match)
        {
            return res.status(400).send({status:false,message:"Invalide password"})
        }
   const token= await jwt.sign({_id:user._id},process.env.JWT_SECRT,{expiresIn:'7d'})

   return res.status(200).send({success:true,message:'login successfull',user:{
    _id:user._id,
    name:user.name,
    email:user.email,
    phone:user.phone,
    address:user.address,
    role:user.role
   },
token})

   }catch(err){
    return res.status(500).send({success:false,message:err})
   }   
} 
//for progotpassword

 exports.forgotPasswordController=async(req,res)=>{
   try{
        const {email,answer,newpassword}=req.body
        if(!email)
          {
            res.status(400).send({success:false,message:"Please enter email"})
          }
          if(!answer)
          {
            res.status(400).send({success:false,message:"Please enter answer"})
          }
          if(!newpassword)
          {
            res.status(400).send({success:false,message:"Please enter newpassword"})
          }
          const user=await usermodel.findOne({email,answer})
          if(!user)
            {
              res.status(400).send({success:false,message:"Please enter valide email and answer"})
            }
            const haseshed=await hashPassword(newpassword)
            await usermodel.findByIdAndUpdate(user._id,{password:haseshed})
            res.status(200).send({
              success:true,
              message:"Password Reset Successfully"
            })
   }catch(err){
    res.status(500).send({success:true,message:"samething went worng ",err})

   }


}

exports.updateProfileCaontroller=async(req,res)=>{
  try{
     const {name,email,password,phone,address}=req.body
     const user=await usermodel.findById(req.user._id)
     if(password && password.lenth<6)
       {
         return res.json({error:"Password is requied and 6 character long"})
       }
     const hashpassword=password ?await hashPassword(password):undefined
       const updateuser=await usermodel.findByIdAndUpdate(req.user._id,
         {name:name||user.name,
          password:hashpassword ||user.password,
           phone:phone || user.phone,
           address:address||user.address
           },{new:true})

           return res.status(200).send({success:true,message:"profile update sucessfully",updateuser})
  }catch(err){
   return res.status(500).send({success:false,message:"samething went wrong in updateprofile"})
  }
}


exports.testcantroller=(req,res)=>{
     res.send("this is testing prosser")
}


exports.getOrdersController=async(req,res)=>{
   try{
   
      const orders=await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
      res.json(orders)
      
   }catch(err){
    console.log(err)
    return res.status(500).send({success:false,message:err})
   }
}


exports.getAllOrdersController=async(req,res)=>{
   try{
    const orders=await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createAt:"-1"})
    res.json(orders)
   }catch(err){
      res.status(500).send({success:false,message:err})
   }

}


exports.orderStatusController=async(req,res)=>{
    
     try{
         const {orderId} =req.params
         const {status}=req.body
         console.log("hi")
         const orders=await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
         res.json(orders)
     }catch(err){
      res.status(500).send({success:false,message:err})
     }
}

