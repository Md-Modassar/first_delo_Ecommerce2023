const mongoose =require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId
const orderSchema=new mongoose.Schema({
   products:[{
     type:objectId,
     ref:'Products'
   },
],
payment:{},
buyer:{
    type:objectId,
    ref:'users'
},
status:{
    type:String,
    default:'Not Process',
    enum:['Not Process','Processing','Shipped','deliver','cancel'],
}
  
},{timestamps:true})


module.exports=mongoose.model('order',orderSchema)
