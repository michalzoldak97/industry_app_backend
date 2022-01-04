const db = require("../db");
const bcrypt = require("bcrypt");

exports.isCorrectPassword = async (recievedPass, userPass) => {
  return await bcrypt.compare(recievedPass, userPass);
};

const getDaysSince = (date) => {
  currDate = new Date();
  const diff = currDate.getTime() - date.getTime();
  return Math.floor(diff / 86400000);
};

exports.getUserByName = async (username) => {
  const queryText = ` 
                      SELECT
                          u.user_id
                          ,u.username
                          ,u.password
                          ,u.last_logged_in
                      FROM tbl_user u
                      WHERE
                          u.username = ?
    `;
  let res = await db.query(queryText, [username]);
  res["0"].last_logged_in = getDaysSince(res["0"].last_logged_in);
  return res["0"];
};

exports.createUser = async (user) => {
  const queryText = `
                      INSERT INTO tbl_user (username, password, last_logged_in)
                      VALUES (?, ?, ?)`;
  const encryptedPass = await bcrypt.hash(user.password, 12);
  return await db.query(queryText, [user.username, encryptedPass, new Date()]);
};

exports.updateLastLogin = async (id) => {
  const queryText = `
                     UPDATE tbl_user u
                     SET last_logged_in = ?
                     WHERE
                        u.user_id = ?
  `;
  const res = await db.query(queryText, [new Date(), id]);
  return res;
};

exports.selectPermissionData = async (id) => {
  const queryText = `
                    SELECT 
                      JSON_ARRAYAGG(JSON_OBJECT('id', p.permission_name)) AS access
                    FROM  tbl_user u
                    INNER JOIN  tbl_user_permission  up                      ON u.user_id = up.user_id
                                                                                AND u.deactivated_datetime IS NULL
                    INNER JOIN  tbl_permission p                             ON up.permission_id = p.permission_id
                    WHERE 
                      u.user_id = ?
                    UNION ALL
                    SELECT 
                      JSON_ARRAYAGG(JSON_OBJECT('id', uc.challenge_id)) AS challenges
                    FROM  tbl_user u
                    INNER JOIN  tbl_user_challenge uc                       ON  u.user_id = uc.user_id
                                                                              AND  u.deactivated_datetime IS NULL             
                    WHERE 
                      u.user_id = ? 
                    UNION ALL
                    SELECT
                      JSON_ARRAYAGG(JSON_OBJECT('id', c.challenge_id)) AS createdChallenges
                    FROM tbl_user u
                    INNER JOIN  tbl_challenge c                             ON  u.user_id = c.created_by_user_id
                                                                              AND  u.deactivated_datetime IS NULL             
                    WHERE 
                      u.user_id = ? 

`;
  const res = await db.query(queryText, [id, id, id]);
  return res;
};
