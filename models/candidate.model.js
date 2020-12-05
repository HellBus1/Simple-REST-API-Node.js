const mongoose = require('mongoose');

const CandidateSchema = mongoose.Schema({
    name: {
     type: String,
     required: true  
    },
    count: Number
 }, {
    timestamps: true
 });

module.exports = mongoose.model('Candidate', CandidateSchema);