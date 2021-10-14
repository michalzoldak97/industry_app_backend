const db = require("../db");
const bcrypt = require("bcrypt");

exports.isCorrectPassword = async (recievedPass, userPass) => {
  return await bcrypt.compare(recievedPass, userPass);
};

exports.getUserByName = async (username) => {
  const queryText = ` SELECT
                             u.user_id
                             ,u.username
                             ,u.password
                        FROM tbl_user u
                        WHERE
                            u.username = ?
    `;
  const res = await db.query(queryText, [username]);
  return res["0"];
};

exports.createUser = async (user) => {
  const queryText = `INSERT INTO tbl_user (username, password)
                      VALUES (?, ?)`;
  const encryptedPass = await bcrypt.hash(user.password, 12);
  return await db.query(queryText, [user.username, encryptedPass]);
};
