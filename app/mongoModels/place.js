// grab the things we need
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create a schema
const placeSchema = new Schema({
  name: String,
});

// the schema is useless so far
// we need to create a model using it
const Place = mongoose.model('Place', placeSchema);

// make this available to our users in our Node applications
module.exports = Place;
