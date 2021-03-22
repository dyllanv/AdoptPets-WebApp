var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('./dbcon.js');
const CORS = require('cors');
const request = require('request');
const bodyParser = require('body-parser');
const geoKey = require('./geoKey.js');
const AWS = require("aws-sdk");
const bucket = 'elasticbeanstalk-us-east-2-181021098475/cs467'
AWS.config.loadFromPath("./config.json");
const s3 = new AWS.S3();
exports.s3 = s3;
exports.bucket = bucket;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(CORS());
app.use(bodyParser.json());

app.use(require('./routes/users'));
app.use(require('./routes/admin'));
app.use(require('./routes/pets'));
app.use(require('./routes/favorites'));

// Get single user/admin/pet data from table
exports.getData = (res, dbQuery, values) =>{
  context = {};
  mysql.pool.query(dbQuery, values, (err, rows, fields) => {
    if(err) {
      console.log(err);
      next(err);
      return;
    }
    JSON.stringify(rows);
    context.rows = rows;
    res.send(context);
  });
};

// Get all user/admin/pet data from table
exports.getAllData = (res, dbQuery) =>{
  context = {};
  mysql.pool.query(dbQuery, (err, rows, fields) => {
    if(err) {
      console.log(err);
      next(err);
      return;
    }
    JSON.stringify(rows);
    context.rows = rows;
    res.send(context);
  });
};

// Validate user/admin login
exports.validateLogin = (res, dbQuery, email, password) => {
  var context = {}
  mysql.pool.query(dbQuery, email, (err, rows, fields) => {
    if(err) {
      console.log(err);
      next(err);
      return;
    }
    if (rows[0]) {
      if (rows[0].password == password) {
        rows[0].password = '';
        JSON.stringify(rows);
        context.rows = rows;
        res.send(context);
      }
      else {
        res.send("Sorry, account was not found or password was incorrect");
      }
    }
    else {
      res.send("Sorry, account was not found or password was incorrect");
    }
  });
}

exports.getCoordinates = function(city, state) {
  var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}&key=${geoKey.geoKey.apiKey}`;
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
      try {
        var coordinates = [];
        var json = JSON.parse(body);
        coordinates.push(parseFloat(json.results[0].geometry.location.lat));
        coordinates.push(parseFloat(json.results[0].geometry.location.lng));
        console.log(coordinates);
        resolve(coordinates);
      } catch(e) {
        reject(e);
      }
    })
  });
}

// Deletes image files from AWS S3 bucket
exports.deletePhoto = function(photo) {
  // Take out Key from photo URL (last 13 characters)
  var key = photo.slice(-13);
  var params = {
      Bucket: bucket,
      Key: key
  }
  s3.deleteObject(params, function(err, data) {
    if (err) {// an error occurred
      console.log(err, err.stack);
    }
    else {// successful response
      console.log(`Photo @ ${photo} deleted.`);
    }
  });
}

// Gets all photos associated with pet/pets (to delete in bulk)
exports.getPhotos = function(rows) {
  var photos = [];
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].photo1) {
      photos.push(rows[i].photo1);
    }
    if (rows[i].photo2) {
      photos.push(rows[i].photo2);
    }
    if (rows[i].photo3) {
      photos.push(rows[i].photo3);
    }
    if (rows[i].photo4) {
      photos.push(rows[i].photo4);
    }
    if (rows[i].photo5) {
      photos.push(rows[i].photo5);
    }
    if (rows[i].photo6) {
      photos.push(rows[i].photo6);
    }
  }
  return photos;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
