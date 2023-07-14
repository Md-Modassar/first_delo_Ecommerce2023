  const { default: slugify } = require('slugify')
const categoryModel=require('../models/categoryModel')
  const slug =require('slugify')
  exports.createCategoryCantroller=async(req,res)=>{
   try{
    console.log(req.bady)
      const {name}=req.body
      
      if(!name)
        {
            return res.status(400).send({message:"Please enter name"})

        }

        const existingcategory=await categoryModel.findOne({name})
        if(existingcategory)
         {
            return res.status(400).send({message:"This category alread exists "})
         }
         const category=await categoryModel.create({name,slug:slugify(name)})
         return res.status(201).send({success:true,message:"new category created",category})
   }catch(err){
    res.status(500).send({success:true,messages:"error in category ", err})
   }
};

exports.updateCategoryController=async(req,res)=>{
     try{
        const {name}=req.body
         const {id}=req.params
         const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})

         res.status(200).send({success:true,message:"category update successfully",category})
     }catch(err){
        return res.status(500).send({success:false,message:"error while upadte category",err})
     }
}

exports.categorycantroller=async(req,res)=>{
     try{
         let category=await categoryModel.find({})
         return res.status(200).send({success:true,message:"All category list",category})
     }catch(err){
      return res.status(500).send({success:false,message:"samething worng in category",err})
     }
}

exports.singalcategoryCantroller=async(req,res)=>{
    try{
          let slug=req.params.slug
          let category=await categoryModel.findOne({slug})
          return res.status(200).send({success:true,message:"get singal category successfull",category})
    }catch(error){
        return res.status(500).send({success:true,message:"samething went worng in singal getcategory",error})
    }

}

exports.deletecategorycantoller=async(req,res)=>{
   try{
      const {id}=req.params
       await categoryModel.findByIdAndDelete(id)
       return res.status(200).send({success:true,message:"delete category successfully"})
   }catch(err){
      return res.status(500).send({seccess:false,messages:"error while deleting ctegory"})
   }
}
