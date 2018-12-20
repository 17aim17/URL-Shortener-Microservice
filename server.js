// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const validator = require('validator');
const crypto     = require('crypto')
const { connect }= require('./db/connect/mongoose')
const { Url } = require('./db/model/Model')

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


// POST route for URL
app.post('/api/shorturl/new', (req,res)=>{
   let data = req.body.URL
   Url.findOne({originalUrl :data}).then(url=>{
       if(url){
          res.send({"original_url":url.originalUrl,"short_url":url.shortUrl})
          return
       }       
       else if(validator.isURL(data)){
          const sUrl =crypto.randomBytes(4).toString('hex')
          const newData =new Url({
            originalUrl: data,
            shortUrl: sUrl
          })
          newData.save().then(url=>{
            return res.send({"original_url":url.originalUrl,"short_url":url.shortUrl})
          })
       }else{
         res.send({"error":"invalid URL"})
       }
      
   }).catch(e=> console.log(e) )

})

// To visit the URL
app.get('/api/shorturl/:id', (req,res)=>{
   const id =  req.params.id;
   Url.findOne({shortUrl:id}).then(url=>{
     return res.redirect(url.originalUrl)
   }).catch(e=> res.send({error:'Invalid URL'}))
    
})

app.get('*' ,(req,res)=>{
  return res.send({msg :'You seem to be Lost'})
})

// listen for requests :)
const listener = app.listen(3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
