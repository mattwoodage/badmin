var mongoose = require('mongoose');

var clubSchema = mongoose.Schema({
  name: String
})

var Club = mongoose.model('Club', clubSchema)

module.exports = Club
