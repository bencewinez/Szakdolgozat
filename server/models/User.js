const mongoose = require('mongoose');
const {Schema, model} = mongoose;

/*
userType:
0 = diák
1 = tanár
2 = admin
*/

const UserSchema = new Schema({
  name: {type: String, required: true, min: 4},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  userType: {type: Number}
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;