module.exports = (app) => {
    const candidate = require('../controllers/candidate.controller.js');

    // Main page
    app.get('/', function(req, res) {
        res.sendfile('index.html');
    });

    // Get all candidates
    app.get('/candidates', candidate.getAll);

    // Create a candidate
    app.post('/create_candidate', candidate.create);

    // Update a candidate
    app.put('/update_candidate', candidate.update);
 }