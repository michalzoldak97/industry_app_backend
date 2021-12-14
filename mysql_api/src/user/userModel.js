"use strict";

const mysql = require("../db");

exports.selectUsers = async (reqUserId) => {
  const query = `
                    SELECT 
                        u.user_id
                        ,u.username
                        ,u.created_datetime
                        ,u.last_logged_in
                    FROM tbl_user u
                    WHERE
                        deactivated_datetime IS NULL
    `;
  const res = await mysql.query(query, []);
  return res;
};
