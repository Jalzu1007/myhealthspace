const { Schema, model } = require("mongoose");

const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
const tz = "America/New York"

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
      get: (ts) => dayjs.tz(ts, "UTC").format('MM/DD/YYYY', tz)
    },
  },
  {
    toJSON: {
      getters: true
    },
  }
);

const Workouts = model("Workouts", workoutSchema);

module.exports = Workouts;
