const { Schema, model } = require('mongoose');

const communitySchema = new Schema({
  post: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  

});

module.exports = model('Community', communitySchema);
