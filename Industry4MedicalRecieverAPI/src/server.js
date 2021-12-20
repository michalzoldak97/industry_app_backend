"use strict";
const amqp = require("amqplib");
const db = require("./db");

const queue = "Smartwatch";
const connection_str =
  "amqp://" +
  process.env.RABBIT_USER +
  ":" +
  process.env.RABBIT_PASSWORD +
  "@rabbitmq";

const insertUserData = async (userID, sleepData) => {
  let data_to_insert = [userID, sleepData];
  let insert_statement =
    "INSERT INTO tbl_user_sleep_data (user_id, sleep_data) VALUES (?, ?);";

  await db.query(insert_statement, data_to_insert);
};

const sendDataToDb = async (msg_recieved) => {
  let recievedJSON = JSON.parse(msg_recieved);
  const userID = recievedJSON.userID.toString();

  delete recievedJSON.userID;

  const sleepData = JSON.stringify(recievedJSON);
  await insertUserData(userID, sleepData);
};

(async () => {
  const connection = await amqp.connect(connection_str, "heartbeat=60");
  const channel = await connection.createChannel();
  channel.prefetch(10);
  process.once("SIGINT", async () => {
    console.log("got sigint, closing connection");
    await channel.close();
    await connection.close();
    process.exit(0);
  });

  await channel.assertQueue(queue, { durable: false });
  channel.consume(queue, async (msg) => {
    if (msg) {
      await sendDataToDb(msg.content.toString());
      channel.ack(msg);
    }
  });
  console.log(" [*] Waiting for messages. To exit press CTRL+ctrl");
})();
