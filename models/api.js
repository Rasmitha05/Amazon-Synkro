// models/Api.js
const mongoose = require('mongoose');

// Define the API schema
const apiSchema = new mongoose.Schema(
  {
    stringField: {
      type: String,
      required: true, // Ensure this is provided when creating a new API record
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: true, // Ensure the user reference is provided
    },
  },
  {
    timestamps: true, // Optionally, add timestamps to track creation and update times
  }
);

// Create the model from the schema
const Api = mongoose.model('Api', apiSchema);

module.exports = Api;
