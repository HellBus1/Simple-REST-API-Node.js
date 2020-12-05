const Candidate = require('../models/candidate.model');

// Get all and return all candidate.
exports.getAll = (req, res) => {
    Candidate.find()
        .then((oCand) => {
            res.send(oCand);
        }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the book."
        });
    });
 };

// Create and Save a new Book
exports.create = (req, res) => {
    // Validate request because in model we required the title
    // console.log(req);
    if(!req.body.name) {
        return res.status(400).send({
            message: "Please enter candidate name."
        });
    }
 
    // Create a book
    const candidate = new Candidate({
        name: req.body.name,
        count: req.body.count || '0'
    });
 
    // Save Book in the database
    candidate.save()
        .then(oBook => {
            res.send(oBook);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Book."
        });
    });
 };

 // Update a book by the bookId
exports.update = (req, res) => {
    // Find where
    Candidate.findByIdAndUpdate(req.body.candidateId, {
        $inc: {count: 1},
    }, {new: true})
        .then(oBook => {
            if(oBook) {
                Candidate.aggregate(

                    [{ "$group": {
                        "_id": "$_id",
                        "name": { "$first": "$name" },  //$first accumulator
                        "count": { "$sum": "$count" },  //$sum accumulator
                    }}],
            
                    function(err, results) {
                        if (err) throw err;
                        console.log(results);
                        req.io.sockets.emit('vote', results);
                    }
                );
                res.send(oBook);
            }
            return res.status(404).send({
                message: "Candidate does not exist with that candidateId " + req.params.bookId
            });
 
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Candidate does not exist with that candidateId " + req.params.bookId
            });
        }
        return res.status(500).send({
            message: "Some error occurred while retrieving the candidate with candidateId" + req.params.bookId
        });
    });
 };