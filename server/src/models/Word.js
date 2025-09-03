const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  _id: String,
  sura: Number,
  aya: Number,
  pos: Number,
  root: String,
  _creationTime: Number
});

module.exports = mongoose.model('Word', wordSchema);
