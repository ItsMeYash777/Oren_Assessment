const mongoose = require("mongoose");
const MetricsSchema = new mongoose.Schema({
  carbonEmissions: [Number],
  waterUsage: [Number],
  wasteGenerated: [Number],
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Metrics = mongoose.model("Metrics", MetricsSchema);

module.exports = Metrics;