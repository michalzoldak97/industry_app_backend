"use strict";
const { catchAsync, AppError } = require("../error");
const amqp = require("amqplib");

const connection_str =
  "amqp://" +
  process.env.RABBIT_USER +
  ":" +
  process.env.RABBIT_PASSWORD +
  "@rabbitmq";
const queue = "Smartwatch";

const publishData = async (body, usrId) => {
  const conn = await amqp.connect(connection_str);
  const ch = await conn.createChannel(conn);

  let msg = body;
  msg.userID = usrId;

  ch.assertQueue(queue, { durable: false });

  ch.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
};

exports.handleSmartwatchData = catchAsync(async (req, res, next) => {
  await publishData(req.body, req.userId);
  res.status(200).json({
    message: "success",
    data: {
      user: req.userId,
    },
  });
});
