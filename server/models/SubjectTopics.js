const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const SubjectTopicSchema = new Schema({
  name: {type: String, required: true},
});

const SubjectTopicModel = model('SubjectTopic', SubjectTopicSchema);

module.exports = SubjectTopicModel;