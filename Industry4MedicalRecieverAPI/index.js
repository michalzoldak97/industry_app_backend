let amqp = require('amqplib/callback_api');
let mysql = require('mysql');

let con = mysql.createConnection({
  host: "mysql",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

function insertUserData(userID, sleepData){
  let data_to_insert = [userID, sleepData];
  let insert_statement = "INSERT INTO tbl_user_sleep_data (user_id, sleep_data) VALUES (?, ?);"

  con.query(insert_statement, data_to_insert, (err, results, fields) =>{
    if (err){
      return console.error(err.message);
    }
  });
}

function sendDataToDb(msg_recieved){
  let recievedJSON = JSON.parse(msg_recieved);
  let userID = recievedJSON.userID.toString();

  delete recievedJSON.userID;

  let sleepData = JSON.stringify(recievedJSON);
  insertUserData(userID, sleepData);
}

const connection_str = 'amqp://' + process.env.RABBIT_USER + ':' + process.env.RABBIT_PASSWORD + '@rabbitmq';


amqp.connect(connection_str, function(error0, connection) 
{
  if (error0) 
  {
      throw error0;
  }
        
  connection.createChannel(function(error1, channel) {
    if (error1) 
    {
        throw error1;
    }
  
    const queue = 'Smartwatch';
          
    channel.assertQueue(queue, {durable: false});
          
      channel.consume(queue, function(msg) {
        if (msg !== null) {
          try{
          sendDataToDb(msg.content.toString());
          channel.ack(msg);
          }catch (error){
            console.log(error);
          }
        }
      });
  });
});
