const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const LessonSchema = new Schema({
    name: {type: String, required: true, min: 4},
    subjectID: {type: String, required: true},
    authorID: {type: String, required: true},
    urlSlug: {type: String, required: true},
    releaseDate: {type: Date, required: true},
});

const LessonModel = model('Lesson', LessonSchema);

module.exports = LessonModel;