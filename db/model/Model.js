const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true
    },
    shortUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Url = mongoose.model('URL', UrlSchema);
module.exports = { Url };
