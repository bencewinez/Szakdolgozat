const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const SubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
});

const SubscriptionModel = model('Subscription', SubscriptionSchema);

module.exports = SubscriptionModel;