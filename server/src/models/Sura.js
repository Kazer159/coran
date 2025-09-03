const mongoose = require('mongoose');

const suraSchema = new mongoose.Schema({
  _id: String,
  number: Number,
  nameArabic: String,
  nameSimple: String,
  nameComplex: String,
  nameTranslated: String,
  revelationPlace: String,
  revelationOrder: Number,
  bismillahPre: Boolean,
  verseCount: Number,
  pageStart: Number,
  pageEnd: Number,
  _creationTime: Number
});

module.exports = mongoose.model('Sura', suraSchema);
