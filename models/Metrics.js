const mongoose = require("mongoose");
const MetricsSchema = new mongoose.Schema({
  carbonEmissions: [Number],
  waterUsage: [Number],
  wasteGenerated: [Number],
}); 

const Metrics = mongoose.model("Metrics", MetricsSchema);

module.exports = Metrics;