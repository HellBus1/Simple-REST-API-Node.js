const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

// create express app
const app = express();

// app.use(cors());

var server   = require('http').Server(app);
var io = require('socket.io')(server, {
   cors: {
     origin: 'http://mypwebshost.000webhostapp.com/',
     methods: ["GET", "POST"],
     credentials: true
   },
 });

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// use socket
app.use(function(req,res,next){
   req.io = io;
   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', 'http://mypwebshost.000webhostapp.com/');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);
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