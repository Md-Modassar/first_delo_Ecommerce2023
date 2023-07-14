const mongoose=require('mongoose');
const colors=require('colors')
const dotenv=require('dotenv')

dotenv.config();

let url=process.env.MONGO_URL
const connectedDB=async()=>{
    try{
       await mongoose.connect(url,{
            useNewUrlParser:true   
        }).then(()=>{
            console.log("mongoDB is connected")
        }).catch((err)=>{
            console.log(err)
        })
    }catch(err){
        console.log(`Error is MongoDB ${err}`,bgRed.white) 
            
        
    }
}

module.exports=connectedDB;