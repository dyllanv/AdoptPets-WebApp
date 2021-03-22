var express = require('express');
var router = express.Router();

var express = require('express');
var router = express.Router();
var main = require('../app.js');
const mysql = require('../dbcon.js');

const getUser = `SELECT userId, password, fname, lname, email FROM users WHERE userId=?;`;
const userLogin = `SELECT * FROM users WHERE email=?;`;
const getAllUsers = `SELECT * FROM users;`;
const insertUser = `INSERT INTO users (password, fname, lname, email) 
                        VALUES (?,?,?,?);`;
const updateUser = `UPDATE users SET password=?, fname=?, lname=?, email=?
                    WHERE userId=?;`;
const deleteUser = `DELETE FROM users WHERE userId=?;`;

const updatePassword = `UPDATE users SET password=? WHERE userId=?;`;

// Get all users data for USERS table <<<FOR TESTING ONLY>>>
router.get('/users', function(req,res,next){
  main.getAllData(res, getAllUsers);
});

// Get single users data for USERS table
router.get('/users/:userId', function(req,res,next){
  main.getData(res, getUser, req.params.userId);
});

// Verify user login with email and password
router.post('/users/login', function(req,res,next){
  var {email, password} = req.body;
  main.validateLogin(res, userLogin, email, password);
});

// Adds user to USERS table
router.post('/users', function(req,res,next){
  var { password, fname, lname, email } = req.body;
  mysql.pool.query(insertUser, [password, fname, lname, email], (err, result) =>{
    if(err){
      next(err);
      return;
    } 
    main.getData(res, getUser, result.insertId);
  });
});

// Delete user
router.delete('/users/:userId', function(req,res,next){
  mysql.pool.query(deleteUser, [req.params.userId], (err, result)=> {
    if(err){
      next(err);
      return;
    }
  });
});

// Update user info
router.put('/users/:userId', function(req,res,next){
  var { password, fname, lname, email, userId } = req.body;
  mysql.pool.query(updateUser, [password, fname, lname, email, userId], (err, result) =>{
    if(err){
      next(err);
      return;
    }
    main.getData(res, getUser, userId);
  });
});

//// Update user password
//router.put('users/password', function(req,res,next){
//  mysql.pool.query(`SELECT password FROM users WHERE userId=${req.body.userId};`, (err, result) =>{
//    if(err){
//      next(err);
//      return;
//    }
//    if (result[0].password == req.body.oldPassword) {
//      mysql.pool.query(updatePassword, [req.body.newPassword, req.body.userId], (err, result) =>{
//        if(err){
//          next(err);
//          return;
//        }
//        main.getData(res, getUser, userId);
//      });
//    }
//    else res.send("Error: Old password does not match.")
//  });
//});



module.exports = router;