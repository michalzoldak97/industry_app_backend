"use strict";

const mysql = require("mysql-await");

const dbConnection = mysql.createConnection({
  host: "mysql",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

exports.query = async (queryText, queryParams) => {
  const start = Date.now();
  const queryRes = await dbConnection.awaitQuery(queryText, queryParams);
  queryRes.duration = Date.now() - start;
  return queryRes;
};
