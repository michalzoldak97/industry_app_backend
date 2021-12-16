"use strict";

const mysql = require("../db");

exports.selectUsers = async () => {
  const query = `
                    SELECT 
                        u.user_id
                        ,u.username
                        ,u.created_datetime
                        ,u.last_logged_in
                    FROM tbl_user u
                    WHERE
                        u.deactivated_datetime IS NULL
    `;
  return await mysql.query(query, []);
};

exports.selectUserById = async (userId) => {
  const query = `
                  SELECT
                      u.user_id
                      ,u.username
                      ,u.created_datetime
                      ,u.last_logged_in
                  FROM tbl_user u
                  WHERE
                      u.deactivated_datetime IS NULL
                      AND u.user_id = ?
  `;
  const res = await mysql.query(query, [userId]);
  return res;
};
