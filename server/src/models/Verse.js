const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  ar: String,
  en: String,
  pos: Number,
  root: String,
  tl: String
});

const verseSchema = new mongoose.Schema({
  _id: String,
  sura: Number,
  aya: Number,
  textAr: String,
  textFr: String,
  textTl: String,
  segments: [segmentSchema],
  _creationTime: Number
});

module.exports = mongoose.model('Verse', verseSchema);
