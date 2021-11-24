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
  const queryText = ` SELECT
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
  const queryText = `INSERT INTO tbl_user (username, password)
                      VALUES (?, ?)`;
  const encryptedPass = await bcrypt.hash(user.password, 12);
  return await db.query(queryText, [user.username, encryptedPass]);
};

exports.updateLastLogin = async (id) => {
  const queryText = `UPDATE tbl_user u
                     SET last_logged_in = ?
                     WHERE
                        u.user_id = ?
  `;
  const res = await db.query(queryText, [new Date(), id]);
  return res;
};
