const bcrypt=require('bcrypt')

exports.hashPassword=async(password)=>{
    try{
        let salt=10
      const hashedpassword=await bcrypt.hash(password,salt)
      return hashedpassword
    }catch(err){
        console.log(err)
    }
}

exports.camparespassword=async(password,hashPassword)=>{
      return await bcrypt.compare(password,hashPassword)
}