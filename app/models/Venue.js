var mongoose = require('mongoose');

var venueSchema = mongoose.Schema({
  name: { type: String, unique: true, required:true },
  address_1: String,
  address_2: String,
  address_3: String,
  town: String,
  postcode: String,
  website: String,
  lat: String,
  lng: String,
  createdAt: Date,
  _old: Number,
  key: String
})

var Venue = mongoose.model('Venue', venueSchema)

module.exports =  Venue
