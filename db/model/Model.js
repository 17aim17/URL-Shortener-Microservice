const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
   originalUrl : {
       type: String,
       required:true
   },
   shortUrl:{
       type:String
   },
   createdAt:{
       type:Date,
       default:Date.now
   }
})

const  Url= mongoose.model('URL' ,UrlSchema);
module.exports  = {Url}