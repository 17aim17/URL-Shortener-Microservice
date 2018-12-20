// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const validator = require('validator');
const dns = require('dns');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json())

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


let arr =[];

// POST route for URL
app.post('/api/shorturl/new', (req,res)=>{
   const data = req.body.URL
   if(validator.isURL(data)){
      arr.push(data);
      res.send({"original_url":data,"short_url":arr.length-1})
   }else{
     res.send({"error":"invalid URL"})
   }

})

// To visit the URL
app.get('/api/shorturl/:id', (req,res)=>{
   const id =  req.params.id;
   const link =arr[parseInt(id)];

   res.redirect(addhttp(link))
   
})

function addhttp(url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "http://" + url;
  }
  return url;
}

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
