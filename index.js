const express=require('express')
const app=express();
const bodyParser = require('body-parser');
const dotenv=require('dotenv')
const mongo=require('./confing/db')
const mongoose=require('mongoose')
const morgan=require('morgan')
const authroutes=require('./routes/authroute')
const categoryRoutes=require('./routes/categoryRoute')
const productRoutes=require('./routes/productRoutes')
const cors=require('cors')
dotenv.config();
const path = require('path')
const {fileURLToPath} = require('url')

var __filename = fileURLToPath('url');
var __dirname = path.dirname(__filename);
app.use(cors())
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'./client/build')))
mongo()
app.use('/api/v1/auth',authroutes)
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoutes)

app.use('*',function(req,res){
   res.sendFile(path.join(__dirname,'./client/build/index.html'))
})
 
let PORT=process.env.PORT||8080
app.listen(PORT,()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`)
})
