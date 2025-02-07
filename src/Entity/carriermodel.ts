import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  careerFields: [
    {
      field: { type: String},
      reason: { type: String }
    }
  ],
  improvementSuggestions: { type: String }
});

const CareerModel = mongoose.model("CareerData", careerSchema);

export default CareerModel;