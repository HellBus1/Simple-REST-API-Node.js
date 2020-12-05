const mongoose = require('mongoose');

const CandidateSchema = mongoose.Schema({
    name: {
     type: String,
     required: true  
    },
    count: String
 }, {
    timestamps: true
 });

module.exports = mongoose.model('Candidate', CandidateSchema);