const jwt=require('jsonwebtoken')
const usermodel=require('../models/usermodel')

exports.requireSignIn=async(req,res,next)=>{
    try {
        const decode=jwt.verify(req.headers.authorization,process.env.JWT_SECRT)
        req.user=decode
        next()
    }catch(err){
        return res.status(500).send({status:false,message:err})
    }

}

exports.isAddmin=async(req,res,next)=>{
     try{
         const user=await usermodel.findById(req.user._id)
         if(user.role!==1)
           {
            return res.status(401).send({status:false,message:'Unauthorized access'})
           }else{
           next()
           }
           
     }catch(err){
        return res.status(500).send({status:false,messsage:"error in addmin middelware"})
     }
}
