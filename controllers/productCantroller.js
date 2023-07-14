const { default: slugify } = require("slugify")
const productModel = require("../models/productModel")
const fs=require('fs')
const categoryModel=require('../models/categoryModel')
const braintree= require('braintree')
const orderModel=require('../models/orderModel')
const dotenv=require('dotenv')
const { ObjectId } = require("mongodb")
 dotenv.config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey:  process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });
exports.createProductController=async(req,res)=>{
   try{
         const {name,slug,description,price,quantity,category,shipping}=req.fields
         const {photo}=req.files
         switch(true)
         {
            case !name:
                  return res.status(400).send({error:"Name is require"}) 
            case !description:
                  return res.status(400).send({error:"description is require"}) 
            case !price:
                 return res.status(400).send({error:"price is require"}) 
            case !quantity:
                 return res.status(400).send({error:"quantuty is require"}) 
            case !category:
                 return res.status(400).send({error:"category is require"})  
            case photo && photo.Size>10024:
                 return res.status(400).send({error:'Photo is required and shoud be be lest than 1MB'})
                }
            

        const products=new productModel({...req.fields,slug:slugify(name)})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type
        }
        await products.save()


        return res.status(201).send({successL:true,message:"product create successfully",products})
   }catch(err){
    return res.status(500).send({success:false,message:"error in create product",err})
   }
}

exports.getproduct=async(req,res)=>{
   try{
       let product=await productModel.find({}).populate('category').select("-photo").limit(12).sort({createAT:-1})
       return res.status(200).send({success:true,message:"get product successfully",product,total:product.length})
   }catch(err){
    return res.status(500).send({success:false,message:"samething went to worng"})
   }
}

exports.getsingalproduct=async(req,res)=>{
    try{
        let {slug}=req.params
        const product=await productModel.findOne({slug}).select("-photo").populate('category')
        return res.status(200).send({success:true,message:"get singal product",product})
    }catch(err)
      {
        return res.status(500).send({success:false,message:"Error while getting singal product",err})
      }
}

exports.productPhotocantroller=async(req,res)=>{
    try{
        const product=await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data)
         {
            res.set('Content-type',product.photo.contentType)
            return res.status(200).send(product.photo.data)
         }
    }catch(err)
    {
        return res.status(500).send({success:false,message:"error in photocantroller"})
    }
}

exports.deleteProduct=async(req,res)=>{
    try{
       let {pid}=req.params
      let data=await productModel.findByIdAndDelete(pid)
      
      if(!data)
        {
            return res.status(404).send("this document not exist")
        }else{
            return res.status(200).send({success:true,message:"Product delete successfully"}).select("-photo")
        }
    }catch(err){
        return res.status(500).send({success:false,message:err.message})
    }
}

exports.updateProductController=async(req,res)=>{
    try{
        const {name,slug,description,price,quantity,category,shipping}=req.fields
        const {photo}=req.files
        switch(true)
        {
           case !name:
                 return res.status(400).send({error:"Name is require"}) 
           case !description:
                 return res.status(400).send({error:"description is require"}) 
           case !price:
                return res.status(400).send({error:"price is require"}) 
           case !quantity:
                return res.status(400).send({error:"quantuty is require"}) 
           case !category:
                return res.status(400).send({error:"category is require"})  
           case photo && photo.Size>10024:
                return res.status(400).send({error:'Photo is required and shoud be be lest than 1MB'})
               }
           

       const products=await productModel.findByIdAndUpdate(req.params.pid,{
        ...req.fields,slug:slugify(name)
       },{new:true})
       if(photo){
           products.photo.data=fs.readFileSync(photo.path)
           products.photo.contentType=photo.type
       }
       await products.save()


       return res.status(201).send({successL:true,message:"product update successfully",products})

    }catch(err){
        return res.status(500).send({success:false,message:"samething went worng in update product"})
    }
}

exports.productFilterControler=async(req,res)=>{
   try{
      const {checked,radio}=req.body
      let args={}
      if(checked.length>0)args.category=checked
      if(radio.length)args.price={$gte:radio[0],$gte:radio[1]}
      const products=await productModel.find(args)
      res.status(200).send({success:true,products})
   }catch(err){
    return res.status(500).send({success:false,message:"samething went wrong in server"})
   }
   
}

exports.productCountController=async(req,res)=>{
    try{
       const total=await productModel.find({}).estimatedDocumentCount()
       return res.status(200).send({success:true,total})
    }catch(err){
        return res.status(500).send({success:false,message:"sameth went to wrong"})
    }
}

exports.productListController=async(req,res)=>{
   try{
         const count=await productModel.find({})
          const perpage=count.length
          const page=req.params.page?req.params.page:1

          const products=await productModel.find({}).select('-photo').skip((page-1)*perpage).limit(perpage).sort({createAT:-1})
          return res.status(200).send({success:true,products})
   }catch(err){
    return res.status(500).send({success:false,message:"samething went wrong",err})
   }
}

exports.searchproductCantroller=async(req,res)=>{
    try{
        const {keyword}=req.params
       
        const result=await productModel.find({$or:[{name:{$regex:keyword,$options:"i"}},
        {description:{$regex:keyword,$options:"i"}}]}).select("-photo")
        
            
        
        res.json(result)
    }catch(err){
        return res.status(500).send({success:false,message:"samething went wrong",err})
    }
    
}

exports.reactedproductController=async(req,res)=>{
    try{
       const {pid,cid}=req.params
       const products=await productModel.find({category:cid,_id:{$ne:pid}}).select("-photo").limit(3).populate('category')
       res.status(200).send({success:true,products})

    }catch(err){
        res.status(500).send({success:false,message:"samethin went to wrong"})
    }
}

exports.productCategoryController=async(req,res)=>{
    try{
        let {slug}=req.params
        const category=await categoryModel.findOne({slug})
        const products=await productModel.find({category}).populate("category")

        return res.status(200).send({success:true,category,products})
    }catch(err){
        return res.status(500).send({success:false,err})
    }
}


//payment gatway api token
exports.braintreeTokenController=async(req,res)=>{
   try{
      gateway.clientToken.generate({},function(error,respose){
        if(error)
        {
            res.status(500).send(error)
        }else{
            res.send(respose)
        }
      })
   }catch(err){
    return res.status(500).send({success:false,message:err})
   }
}

//payment
exports.brainTreePaymentContoller=async(req,res)=>{
    try{
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
          total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
          {
            amount: total,
            paymentMethodNonce: nonce,
            options: {
              submitForSettlement: true,
            },
          },
          function (error, result) {
            if (result) {
              const order = new orderModel({
                products: cart,
                payment: result,
                buyer: req.user._id,
              }).save();
              res.json({ ok: true });
            } else {
              res.status(500).send(error);
            }
          }
        );
    
         

    }catch(err){
        return res.status(500).send(err)
    }
}