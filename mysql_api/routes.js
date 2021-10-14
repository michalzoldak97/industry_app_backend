const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
var router = express.Router();

function authorization(req){
  var str = JSON.stringify(req.headers.authorization);
  var rest = str.split(" ");
  var token = rest[1].split('"');
  console.log(rest);
  console.log(token);
  jwt.verify(token[0], process.env.JWT_SECRET, function(err, decoded) {
    if(err){
      throw err;
    }
    console.log(decoded.userID) 
    
  });

}

const con = mysql.createConnection({
    host: 'mysql',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });
  
 //USER
router.get('/users', function(req, res) { 
    authorization(req);
    con.query('SELECT * FROM tbl_user', (err, rows) => {
        if(err) throw err;
        res.json(rows);
      });
});

router.get('/user', function(req, res) {
  var user_id;
  var str = JSON.stringify(req.headers.authorization);
  var rest = str.split(" ");
  var token = rest[1].split('"');
  console.log(rest);
  console.log(token);
  jwt.verify(token[0], process.env.JWT_SECRET, function(err, decoded) {
  if(err){
    throw err;
  }
  console.log(decoded.userID) 
  user_id = decoded.userID;
});
  con.query(
      'SELECT * FROM tbl_user WHERE user_id = ?', [user_id], (err, sqlRes) => {
        if (err) throw err;
        res.json(sqlRes);
      }
    );
});

router.post('/user', function(req, res) { 
    authorization(req);
    const user = req.body;
    con.query('INSERT INTO tbl_user SET ?', user, (err, sqlRes) => {
        if(err) throw err;
        res.json(sqlRes);
      });
});

router.delete('/user/:id', function(req, res) {
    authorization(req);
    const u_id = req.params.id;
    con.query(
        'DELETE FROM tbl_user WHERE user_id = ?', [u_id], (err, sqlRes) => {
          if (err) throw err;
          res.json(sqlRes);
        }
      );
});

//CHALLENGE

router.get('/challenge', function(req, res) { 
  authorization(req);
    con.query('SELECT * FROM tbl_challenge', (err, rows) => {
        if(err) throw err;
        res.json(rows);
      });
});


router.get('/challenge/:id', function(req, res) {
  authorization(req);
  const ch_id = req.params.id;
  con.query(
      'SELECT * FROM tbl_challenge WHERE challenge_id = ?', [ch_id], (err, sqlRes) => {
        if (err) throw err;
        res.json(sqlRes);
      }
    );
});

router.post('/challenge', function(req, res) { 
  authorization(req);
    const challenge = req.body;
    con.query('INSERT INTO tbl_challenge SET ?', challenge, (err, sqlRes) => {
        if(err) throw err;
        res.json(sqlRes);
      });
});

router.delete('/challenge/:id', function(req, res) {
  authorization(req);
    const ch_id = req.params.id;
    con.query(
        'DELETE FROM tbl_challenge WHERE challenge_id = ?', [ch_id], (err, sqlRes) => {
          if (err) throw err;
          res.json(sqlRes);
        }
      );
});

//USER'S CHALLENGE

router.get('/user_challenge', function(req, res) { 
  authorization(req);
    con.query('SELECT * FROM tbl_user_challenge', (err, rows) => {
        if(err) throw err;
        res.json(rows);
      });
});


router.get('/user_challenge/:id', function(req, res) {
  authorization(req);
  const u_ch_id = req.params.id;
  con.query(
      'SELECT * FROM tbl_user_challenge WHERE user_challenge_id = ?', [u_ch_id], (err, sqlRes) => {
        if (err) throw err;
        res.json(sqlRes);
      }
    );
});


router.post('/user_challenge', function(req, res) { 
  authorization(req);
    const u_challenge = req.body;
    con.query('INSERT INTO tbl_user_challenge SET ?', u_challenge, (err, sqlRes) => {
        if(err) throw err;
        res.json(sqlRes);
      });
});

router.delete('/user_challenge/:id', function(req, res) {
  authorization(req);
    const u_ch_id = req.params.id;
    con.query(
        'DELETE FROM tbl_user_challenge WHERE user_challenge_id = ?', [u_ch_id], (err, sqlRes) => {
          if (err) throw err;
          res.json(sqlRes);
        }
      );
});

//USER'S SLEEP

router.get('/users_sleep', function(req, res) { 
  authorization(req);
    con.query('SELECT * FROM tbl_user_sleep_data', (err, rows) => {
        if(err) throw err;
        res.json(rows);
      });
});

router.get('/user_sleep', function(req, res) {
  var u_sleep_id;
  var str = JSON.stringify(req.headers.authorization);
  var rest = str.split(" ");
  var token = rest[1].split('"');
  console.log(rest);
  console.log(token);
  jwt.verify(token[0], process.env.JWT_SECRET, function(err, decoded) {
  if(err){
    throw err;
  }
  console.log(decoded.userID) 
  u_sleep_id = decoded.userID;
});
  con.query(
      'SELECT * FROM tbl_user_sleep_data WHERE user_id = ?', [u_sleep_id], (err, sqlRes) => {
        if (err) throw err;
        res.json(sqlRes);
      }
    );
});

router.post('/user_sleep', function(req, res) { 
  authorization(req);
    const u_sleep = req.body;
    con.query('INSERT INTO tbl_user_sleep_data SET ?', u_sleep, (err, sqlRes) => {
        if(err) throw err;
        res.json(sqlRes);
      });
});

router.delete('/user_sleep/:id', function(req, res) {
  authorization(req);
    const u_sleep_id = req.params.id;
    con.query(
        'DELETE FROM tbl_user_sleep_data WHERE user_sleep_data_id = ?', [u_sleep_id], (err, sqlRes) => {
          if (err) throw err;
          res.json(sqlRes);
        }
      );
});


module.exports = router;