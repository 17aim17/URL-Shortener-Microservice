const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const validator = require('validator');
const crypto = require('crypto');
const { connect } = require('./db/connect/mongoose');
const { Url } = require('./db/model/Model');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(request, response) {
  response.sendFile(__dirname + 'index.html');
});

// POST route for URL
app.post('/api/shorturl/new', (req, res) => {
  let data = req.body.URL;

  Url.findOne({ originalUrl: data })
    .then(url => {
      if (url) {
        return res.status(200).json({
          original_url: url.originalUrl,
          short_url: `${req.protocol}://${req.headers.host}/api/shorturl/${
            url.shortUrl
          }`,
          token: url.shortUrl
        });
      } else if (validator.isURL(data)) {
        const sUrl = crypto.randomBytes(4).toString('hex');
        console.log(sUrl);

        const newData = new Url({
          originalUrl: data,
          shortUrl: sUrl
        });
        newData.save().then(url => {
          return res.status(201).json({
            original_url: url.originalUrl,
            short_url: `${req.protocol}://${req.headers.host}/api/shorturl/${
              url.shortUrl
            }`,
            token: url.shortUrl
          });
        });
      } else {
        res.status(400).json({ error: 'Invalid URL' });
      }
    })
    .catch(e => console.log(e));
});

// To visit the URL
app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  Url.findOne({ shortUrl: id })
    .then(url => {
      let link = url.originalUrl;
      link = link.indexOf('://') === -1 ? 'http://' + link : link;
      return res.redirect(link);
    })
    .catch(e => console.log(e));
});

app.use((req, res, next) => {
  return res.redirect('/');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
