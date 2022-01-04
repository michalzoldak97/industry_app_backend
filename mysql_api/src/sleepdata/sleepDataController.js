"use strict";
const { catchAsync, AppError } = require("../error");
const responseHandler = require("../handler");
const axios = require("axios");

exports.getClassifiedData = catchAsync(async (req, res, next) => {
  const response = await axios
    .get(
      `http://sleep_data_ai:5000/sleepdata?userid=56&fromdate=2021-12-02 00:10:15&todate=2021-12-02 01:18:12`
    )
    .catch((err) => {
      return next(new AppError(`AI service fail: ${err}`, 500));
    });
  console.log(Object.keys(response));
  responseHandler.respond(
    { head: response.data, data: response.data },
    { sCode: 200, errCode: 500, errMessage: "Sleep data not found" },
    res,
    next
  );
});
