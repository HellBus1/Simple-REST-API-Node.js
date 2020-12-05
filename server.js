const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

// create express app
const app = express();

// app.use(cors());

var server   = require('http').Server(app);
var io = require('socket.io')(server, {
   cors: {
     origin: 'http://mypwebshost.000webhostapp.com/grafik.php',
   //   methods: ["GET", "POST", "PUT", "DELETE"],
   },
 });

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// use socket
app.use(function(req,res,next){
   req.io = io;
   next();
});

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


io.on('connection', function (socket) {

   Vote.aggregate(

      [{ "$group": {
         "_id": "$_id",
         "name": { "$first": "$name" },  //$first accumulator
         "count": { "$sum": "$count" },  //$sum accumulator
      }}],

      function(err, results) {
         if (err) throw err;

         socket.emit('vote', results);
      }
   );

});

// listen for requests
app.listen(process.env.PORT || 3000, () => {
   console.log("Server is listening on port 3000");
});