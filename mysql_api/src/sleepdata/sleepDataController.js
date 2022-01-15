"use strict";
const { catchAsync, AppError } = require("../error");
const responseHandler = require("../handler");
const axios = require("axios");

exports.getClassifiedData = catchAsync(async (req, res, next) => {
  const { fromdate, todate } = req.query;
  if (!fromdate || !todate)
    return next(new AppError(`Invalid query parameters`, 500));
  const response = await axios
    .get(
      `http://sleep_data_ai:5000/sleepdata?userid=${req.userId}&fromdate=${fromdate}&todate=${todate}`
    )
    .catch((err) => {
      return next(new AppError(`AI service fail: ${err}`, 500));
    });
  responseHandler.respond(
    { head: response.data, data: response.data },
    { sCode: 200, errCode: 500, errMessage: "Sleep data not found" },
    res,
    next
  );
});
