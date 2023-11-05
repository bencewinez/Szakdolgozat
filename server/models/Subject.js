const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const SubjectSchema = new Schema({
  name: {type: String, required: true, min: 4},
  description: {type: String},
  author: {type: String, required: true},
  urlSlug: {type: String, required: true, min: 4},
  lessonsCount: {type: Number},
});

const SubjectModel = model('User', SubjectSchema);

module.exports = SubjectModel;