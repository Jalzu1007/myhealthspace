const { Schema, model } = require("mongoose");

const workoutSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["cardio", "resistance"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 30,
    },
    distance: {
      type: Number,
      required: function () {
        return this.type === "cardio";
      },
    },
    duration: {
      type: Number,
      required: function () {
        return this.type === "cardio";
      },
    },
    weight: {
      type: Number,
      required: function () {
        return this.type === "resistance";
      },
    },
    sets: {
      type: Number,
      required: function () {
        return this.type === "resistance";
      },
    },
    reps: {
      type: Number,
      required: function () {
        return this.type === "resistance";
      },
    },
    date: {
      type: Date,
      required: true,
    },
  }
);

const Workouts = model("Workouts", workoutSchema);

module.exports = Workouts;
