var express = require('express');
var router = express.Router();
var main = require('../app.js');
const mysql = require('../dbcon.js');
const AWS = require("aws-sdk");
const bodyParser = require('body-parser');
const multer = require('multer'); // "^1.3.0"
const multerS3 = require('multer-s3'); //"^2.7.0"

const getPet = `SELECT p.*, a.shelterName, a.website, a.email FROM pets p 
                        JOIN  admin a ON p.sellerId=a.sellerId WHERE petId=?;`;
const getAllPets = `SELECT * FROM pets;`
const insertPet = `INSERT INTO pets (sellerId, status, animal, name, breed, sex, age, ageGroup,
                        weight, size, adoptionFee, aboutMe, city, state, latitude, longitude, photo1,
                        photo2, photo3, photo4, photo5, photo6, goodWithKids,
                        goodWithDogs, goodWithCats, requiresFence, houseTrained,
                        neuteredSpayed, shotsUpToDate)
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
const updatePet = `UPDATE pets SET sellerId=?, status=?, animal=?, name=?, breed=?, sex=?, age=?,
                        ageGroup=?, weight=?, size=?, adoptionFee=?, aboutMe=?, city=?, state=?, 
                        latitude=?, longitude=?, goodWithKids=?, goodWithDogs=?, goodWithCats=?, 
                        requiresFence=?, houseTrained=?, neuteredSpayed=?, shotsUpToDate=?
                        WHERE petId=?;`;
const deletePet = `DELETE FROM pets WHERE petId=?;`;
const updatePhoto = `UPDATE pets SET ?=? WHERE petId=?;`;
const getPhoto1 = `SELECT photo1 FROM pets WHERE petId=?`;


// Uploads image file to AWS S3 bucket
var upload = multer({
  storage: multerS3({
      s3: main.s3,
      acl: 'public-read',
      bucket: main.bucket,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      contentDisposition: 'inline',
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
  })
});

// Takes search requests from form and generates a query for all pets meeting criteria
function generateSearchQuery(params) {
  // Haversine formula: Finds distance (in miles) between latitude and longitude coordinates
  // Takes coordinates from chosen search location (after finding coordinates), then checks
  // database for coorindates within X 'distance'/radius (which is added to query at end as 'distance')
  var query = `SELECT *, ( 3959 * acos( cos( radians(${params.latitude}) ) * cos( radians( latitude ) )
    * cos( radians( longitude ) - radians(${params.longitude}) ) + sin( radians(${params.latitude}) ) 
    * sin( radians( latitude ) ) ) ) AS distance
    FROM pets WHERE `;
  
  var attributes = ['breed', 'sex', 'ageGroup', 'size', 'goodWithKids', 'goodWithDogs', 
    'goodWithCats', 'requiresFence', 'houseTrained', 'neuteredSpayed', 'shotsUpToDate']
  
  var parameters = [params.breed, params.sex, params.ageGroup, params.size, 
    params.goodWithKids, params.goodWithDogs, params.goodWithCats, params.requiresFence, 
    params.houseTrained, params.neuteredSpayed, params.shotsUpToDate]
  
  if (params.animal == "Dog" || params.animal == "Cat") {
    query += `animal='${params.animal}'`;
    firstConstraint = false;
  }
  else {
    query += `animal!='Dog' AND animal!='Cat'`;
  }
  for (var i = 0; i < attributes.length; i++) {
    if (parameters[i]){
      query += ` AND ${attributes[i]}='${parameters[i]}'`
    }
  }
  query += ` HAVING distance < ${params.distance} ORDER BY distance`;
  return query;
}

function getAgeGroup(age) {
  // Determine ageGroup based on age
  var ageGroup;
  if (age < 1) {
    ageGroup = "Baby";
  }
  else if (age < 4) {
    ageGroup = "Young";
  }
  else if (age < 9) {
    ageGroup = "Adult"
  }
  else {
    ageGroup = "Senior"
  }
  return ageGroup;
}

// Get all pets data for PETS table
router.get('/pets', function(req,res,next){
  main.getAllData(res, getAllPets);
});

// Get all pets data for PETS table
router.get('/pets/search', function(req,res,next){
  main.getCoordinates(req.query.city, req.query.state).then(function(val) {
    req.query.latitude = val[0];
    req.query.longitude = val[1];
    // Default search radius = 50 miles
    if (!req.query.distance) {
      req.query.distance = 50;
    }
    var query =  generateSearchQuery(req.query);
  
    main.getAllData(res, query);
  }).catch(function(err) {
    console.log(err);
  });  
});

// Get single pet data for PETS table
router.get('/pet/:petId', function(req,res,next){
  main.getData(res, getPet, req.params.petId);
});

// Adds pet to PETS table.
router.post('/pets', upload.array('photo', 6), function(req,res,next){
  var { sellerId, status, animal, name, breed, sex, age, weight, size, 
    adoptionFee, aboutMe, city, state, photo1, photo2, photo3, photo4, 
    photo5, photo6, goodWithKids, goodWithDogs, goodWithCats, requiresFence, 
    houseTrained, neuteredSpayed, shotsUpToDate } = req.body;
  
  // Assign photos to store in DB
  photo1 = req.files[0].location;
  if (req.files[1]) {
    photo2 = req.files[1].location;
  }
  if (req.files[2]) {
    photo3 = req.files[2].location;
  }
  if (req.files[3]) {
    photo4 = req.files[3].location;
  }
  if (req.files[4]) {
    photo5 = req.files[4].location;
  }
  if (req.files[5]) {
    photo6 = req.files[5].location;
  }

  // Determine ageGroup based on age
  var ageGroup = getAgeGroup(age);
  
  // Get lat/long coordinates, then store in DB
  main.getCoordinates(city, state).then(function(val) {
    var latitude = val[0];
    var longitude = val[1];
    mysql.pool.query(insertPet, [sellerId, status, animal, name, breed, sex, age, ageGroup, 
      weight, size, adoptionFee, aboutMe, city, state, latitude, longitude, photo1, photo2, 
      photo3, photo4, photo5, photo6, goodWithKids, goodWithDogs, goodWithCats, requiresFence, 
      houseTrained, neuteredSpayed, shotsUpToDate], (err, result) =>{
      if(err){
        next(err);
        return;
      } 
      main.getData(res, getPet, result.insertId);
    });
  }).catch(function(err) {
    console.log(err);
  })
});

// Delete pet
router.delete('/pets/:petId', function(req,res,next){
  var photos = [];
  mysql.pool.query(getPet, req.params.petId, (err, rows, fields) => {
    if(err) {
      console.log(err);
      next(err);
      return;
    }
    photos = main.getPhotos(rows);
  });
  mysql.pool.query(deletePet, req.params.petId, (err, result)=> {
    if(err){
      next(err);
      return;
    }
    for (var i = 0; i < photos.length; i++) {
      main.deletePhoto(photos[i]);
    }
  });
});

// Update pet info
router.put('/pets/:petId', function(req,res,next){
  var { sellerId, status, animal, name, breed, sex, age, weight, size, 
    adoptionFee, aboutMe, city, state, goodWithKids, goodWithDogs, goodWithCats, 
    requiresFence, houseTrained, neuteredSpayed, shotsUpToDate, petId } = req.body;
  
  // Determine ageGroup based on pet's age
  var ageGroup = getAgeGroup(age);

  main.getCoordinates(city, state).then(function(val) {
    var latitude = val[0];
    var longitude = val[1];
    mysql.pool.query(updatePet, [sellerId, status, animal, name, breed, sex, age, 
      ageGroup, weight, size, adoptionFee, aboutMe, city, state, latitude, longitude, 
      goodWithKids, goodWithDogs, goodWithCats, requiresFence, houseTrained, 
      neuteredSpayed, shotsUpToDate, petId], (err, result) =>{
      if(err){
        next(err);
        return;
      } 
      main.getData(res, getPet, result.insertId);
    });
  }).catch(function(err) {
    console.err(err);
  });
});

// Edit pet page: Delete single photo
router.delete('/photo', function(req,res,next){
  var { petId, photoX, photoUrl } = req.body;
  mysql.pool.query(`UPDATE pets SET ${photoX}=null WHERE petId=${petId};`, (err, result) =>{
    if(err){
      console.log(err);
      next(err);
      return;
    }
    main.deletePhoto(photoUrl);
    main.getData(res, getPet, petId);
  });
});
  
// Edit pet page: Add single photo
router.post('/photo', upload.array('photo', 1), function(req,res,next) {
  var { petId, photoX } = req.body;
  // Photo1 cannot be empty. Condition for 'changing' photo1 (delete/add new)
  if (photoX == 'photo1') {
    mysql.pool.query(getPhoto1, petId, (err, rows, fields) => {
      if(err) {
        console.log(err);
        next(err);
        return;
      }
      main.deletePhoto(rows[0].photo1);
    });
  }

  // Update photo in DB with new URL
  mysql.pool.query(`UPDATE pets SET ${photoX}='${req.files[0].location}' WHERE petId=${petId};`, 
    (err, result) =>{
    if(err){
      console.log(err);
      next(err);
      return;
    }
    main.getData(res, getPet, petId);
  });
});

module.exports = router;
