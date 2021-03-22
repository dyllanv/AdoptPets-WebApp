var express = require('express');
var router = express.Router();
var main = require('../app.js');
const mysql = require('../dbcon.js');

const getAdmin = `SELECT sellerId, password, shelterName, city, state, latitude, longitude, aboutMe, fname, 
                        lname, email, website, phone FROM admin WHERE sellerId=?;`;
const adminLogin = `SELECT * FROM admin WHERE email=?;`;
const getAllAdmin = `SELECT * FROM admin;`;
const getAdminPets = `SELECT * FROM pets WHERE sellerId=?;`;
const insertAdmin = `INSERT INTO admin (password, shelterName, city, state, latitude, longitude,
                        aboutMe, fname, lname, email, website, phone)
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`; 
const updateAdmin = `UPDATE admin SET password=?, shelterName=?, city=?, state=?, latitude=?,
                        longitude=?, aboutMe=?, fname=?, lname=?, email=?, website=?, phone=?
                        WHERE sellerId=?;`;
const deleteAdmin = `DELETE FROM admin WHERE sellerId=?;`;

// Get all admin data for ADMIN table <<<FOR TESTING ONLY>>>
router.get('/admin', function(req,res,next){
  main.getAllData(res, getAllAdmin);
});
  
router.post('/admin/login', function(req,res,next){
  var {email, password} = req.body;
  main.validateLogin(res, adminLogin, email, password);
});

// Get single admin data for ADMIN table
router.get('/admin/:sellerId', function(req,res,next){
  main.getData(res, getAdmin, req.params.sellerId);
});

// Get single admin data for ADMIN table
router.get('/admin/:sellerId/pets', function(req,res,next){
  main.getData(res, getAdminPets, req.params.sellerId);
});

// Adds admin to ADMIN table
router.post('/admin', function(req,res,next){
  var { password, shelterName, city, state, aboutMe, fname, lname, 
    email, website, phone } = req.body;

  main.getCoordinates(city, state).then(function(val) {
    var latitude = val[0];
    var longitude = val[1];
    mysql.pool.query(insertAdmin, [password, shelterName, city, state, latitude, 
      longitude, aboutMe, fname, lname, email, website, phone], (err, result) =>{
      if(err){
        next(err);
        return;
      } 
      main.getData(res, getAdmin, result.insertId);
    });
  }).catch(function(err) {
    console.log(err);
  })
});

// Delete admin
router.delete('/admin/:sellerId', function(req,res,next){
  // Get all admin's listed pets to delete photos from AWS S3
  mysql.pool.query(getAdminPets, req.params.sellerId, (err, rows, fields) => {
    if(err) {
      console.log(err);
      next(err);
      return;
    }
    photos = main.getPhotos(rows);

    mysql.pool.query(deleteAdmin, [req.params.sellerId], (err, result)=> {
      if(err){
        next(err);
        return;
      }
      // Delete all pet photos
      for (var i = 0; i < photos.length; i++) {
        main.deletePhoto(photos[i]);
      }
    });
  });
});

// Update admin info
router.put('/admin/:sellerId', function(req,res,next){
  var { password, shelterName, city, state, aboutMe, fname, lname, 
    email, website, phone, sellerId } = req.body;

  main.getCoordinates(city, state).then(function(val) {
    var latitude = val[0];
    var longitude = val[1];
    mysql.pool.query(updateAdmin, [password, shelterName, city, state, latitude, 
      longitude, aboutMe, fname, lname, email, website, phone, sellerId], 
      (err, result) =>{
      if(err){
        next(err);
        return;
      }
      main.getData(res, getAdmin, sellerId);
    });
  }).catch(function(err) {
      console.err(err);
  });
});

module.exports = router;
