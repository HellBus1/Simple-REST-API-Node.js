const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json());

// configuring the database
const dbConfig = require('./config/development.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// connecting to database 
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the express-mongo-app database");
 }).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
 });

// define a simple route
app.get('/', (req, res) => {
   res.json({"message": "Welcome to ExpressMongoApp application. Created by IT Jugadu"});
});

require('./routes/candidate.routes.js')(app);

// listen for requests
app.listen(process.env.PORT || 3000, () => {
   console.log("Server is listening on port 3000");
});