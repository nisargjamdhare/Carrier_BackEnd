import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
 
    collegeName : String,
    collegeLocation : String,
    collegeType : String,
    collegeFees : Number,
    Rank : Number,
    officialWebsite : String ,
    
});

const CollegeModel = mongoose.model("Colleges", collegeSchema);

export default CollegeModel;