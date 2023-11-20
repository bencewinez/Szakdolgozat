const mongoose = require('mongoose');
const {Schema, model} = mongoose;

/*
Státuszok:
0 = nem kezdte el
1 = folyamatban van
2 = befejezte
*/

const LessonStatusSchema = new Schema({
    lessonID: {type: String, required: true},
    userID: {type: String, required: true},
    status: {type: Number, required: true},
});

const LessonStatusModel = model('LessonStatus', LessonStatusSchema);

module.exports = LessonStatusModel;