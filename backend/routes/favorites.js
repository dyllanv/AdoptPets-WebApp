var express = require('express');
var router = express.Router();
var main = require('../app.js');
const mysql = require('../dbcon.js');


const getFavorites = `SELECT p.* FROM pets p
                        JOIN favorites f ON f.petId = p.petId
                        WHERE f.userId=?;`;
const insertFavorite = `INSERT INTO favorites (userId, petId) VALUES (?,?);`;
const deleteFavorite = `DELETE FROM favorites WHERE userId=? AND petId=?;`;

// Get user's favorite pets data from FAVORITES/PETS tables
router.get('/favorites/:userId', function(req,res,next){
  main.getData(res, getFavorites, req.params.userId);
});

// Adds user/pet pair to FAVORITES table
router.post('/favorites', function(req,res,next){
  var { userId, petId } = req.body;
  mysql.pool.query(insertFavorite, [userId, petId], (err, result) =>{
    if(err){
      next(err);
      return;
    } 
    main.getData(res, getFavorites, userId);
  });
});

// Delete favorite
router.delete('/favorites', function(req,res,next){
  var { userId, petId } = req.body
  mysql.pool.query(deleteFavorite, [userId, petId], (err, result)=> {
    if(err){
      next(err);
      return;
    }
    main.getData(res, getFavorites, userId);
  });
});

module.exports = router;