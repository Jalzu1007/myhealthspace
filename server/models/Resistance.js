const { Schema, model } = require("mongoose");

const resistanceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 30
    },
    weight: {
      type: Number,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }
);

const Resistance = model("Resistance", resistanceSchema);

module.exports = Resistance;