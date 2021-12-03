const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }, 
  region: {
    type: String
  }
});

module.exports = mongoose.model('Country', CountrySchema);