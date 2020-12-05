module.exports = (app) => {
    const candidate = require('../controllers/candidate.controller.js');

    // Get all candidates
    app.get('/candidates', candidate.getAll);

    // Create a candidate
    app.post('/create_candidate', candidate.create);
 }