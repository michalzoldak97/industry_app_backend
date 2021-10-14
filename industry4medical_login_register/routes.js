const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
var router = express.Router();

const con = mysql.createConnection({
    host: 'mysql',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

router.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  console.log(req.body);

  con.query(
      'SELECT user_id, username, password FROM tbl_user WHERE username = ?', [username], (err, results) => {
        if (err) throw err;
        console.log('>> results: ', results );
        var string=JSON.stringify(results);
        console.log('>> string: ', string );
        var json =  JSON.parse(string);
        console.log('>> json: ', json);
        if (results == "") {
          res.send("User does not exists");
        } 
        else
        {
          if (json[0].username == username && json[0].password == password) {
            console.log();
            var token = jwt.sign({ userID: json[0].user_id }, process.env.JWT_SECRET);
            var response = {
              jwt: token
            }
            res.json(response)
          } else {
            console.log("dbusername: " + json[0].username);
            console.log("username: " + username);
            res.json("not ok");
          }}

      }
    );
});

router.post('/register', function(req, res) { 
    const user = req.body;
    con.query('INSERT INTO tbl_user SET ?', user, (err, sqlRes) => {
        if(err) throw err;
        res.json(sqlRes);
      });
});

module.exports = router;