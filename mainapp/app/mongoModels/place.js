// grab the things we need
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create a schema
const placeSchema = new Schema({
  name: String,
  updated_at: Date,
  created_at: Date,
});


placeSchema.methods.registerActivity = function () {
  const currentDate = new Date();
  this.updated_at = currentDate;
};

placeSchema.pre('save', function (next) {
    // get the current date
  const currentDate = new Date();

    // change the updated_at field to current date
  this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});
// the schema is useless so far
// we need to create a model using it
const Place = mongoose.model('Place', placeSchema);


// make this available to our users in our Node applications
module.exports = Place;
