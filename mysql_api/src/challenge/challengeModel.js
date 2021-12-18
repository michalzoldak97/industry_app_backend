"use strict";
const mysql = require("../db");

exports.selectAllChallenges = async () => {
  const query = `
                    SELECT * FROM tbl_challenge
    `;
  return await mysql.query(query, []);
};

exports.selectChallenge = async (challengeId) => {
  const query = `
                    SELECT * FROM tbl_challenge
                    WHERE
                        challenge_id = ?
    `;
  return await mysql.query(query, [challengeId]);
};

exports.insertChallenge = async (challengeData) => {
  const query = `
                    INSERT INTO tbl_challenge (challenge_name, challenge_description, valid_from_datetime, valid_to_datetime, created_by_user_id)
                    VALUES (?, ?, ?, ?, ?)
    `;
  const { affectedRows: res } = await mysql.query(query, [
    challengeData.name,
    challengeData.description,
    challengeData.validFrom,
    challengeData.validTo,
    challengeData.userId,
  ]);
  return res;
};

exports.updateChallenge = async (challengeData, challengeId) => {
  const query = `
                    UPDATE tbl_challenge
                    SET 
                        challenge_name = ?
                        ,challenge_description = ?
                        ,valid_from_datetime = ?
                        ,valid_to_datetime = ?
                    WHERE
                        challenge_id = ?
    `;
  const { affectedRows: res } = await mysql.query(query, [
    challengeData.name,
    challengeData.description,
    challengeData.validFrom,
    challengeData.validTo,
    challengeId,
  ]);

  console.log(`${res.affectedRows}, ${res.changedRows}`);
  return res;
};
