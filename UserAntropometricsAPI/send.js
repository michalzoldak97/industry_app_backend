var amqp = require('amqplib/callback_api');
var express = require("express");
var myParser = require("body-parser");
var jwt = require('jsonwebtoken');
var app = express();


function authorization(token){
    jwt.verify(token[0], process.env.JWT_SECRET, function(err, decoded) {
      if(err){
        throw err;
      }
      console.log(decoded.userID) 
    });
  
  }

app.use(myParser.json({extended : true}));

app.post("/smartwatchdata", function(request, response) {

    console.log(request.body); 
    console.log(request.headers);

    var str = JSON.stringify(request.headers.authorization);
    var rest = str.split(" ");
    var token = rest[1].split('"');
    authorization(token);
    const payload = token[0].split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());

    const connection_str = 'amqp://' + process.env.RABBIT_USER + ':' + process.env.RABBIT_PASSWORD + '@rabbitmq';

    amqp.connect(connection_str, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
    
            const queue = 'Smartwatch';
            
            var msg = request.body;
            msg.userID = decoded.userID;

            channel.assertQueue(queue, {durable: false});
            
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(" [x] Sent %s", Buffer.from(JSON.stringify(request.body)));

            response.json("OK");
        });
    });
});

app.listen(8081);
console.log("running");
