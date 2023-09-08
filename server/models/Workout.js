// models/workout.js
const { Schema, model } = require('mongoose')

const workoutSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    muscle: {
        type: String,
        required: true,
    },
    equipment: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
      },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    });

module.exports = model('Workout', workoutSchema);
