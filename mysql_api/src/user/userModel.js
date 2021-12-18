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
  return await mysql.query(query, [userId]);
};

exports.deactivateUser = async (userId) => {
  const query = `
                  UPDATE tbl_user u
                  SET deactivated_datetime = CURRENT_TIMESTAMP()
                  WHERE
                    u.user_id = ?
  `;
  const { affectedRows } = await mysql.query(query, [userId]);
  return affectedRows;
};

exports.selectUserChallenges = async (userId) => {
  const query = `
                  SELECT DISTINCT
                      uc.challenge_id
                  FROM tbl_user u
                  INNER JOIN tbl_user_challenge uc              ON u.user_id = uc.user_id
                  WHERE
                    u.deactivated_datetime IS NULL
                    AND u.user_id = ?
  `;
  const res = await mysql.query(query, [userId]);
  return res.map((x) => x?.challenge_id);
};

exports.selectUserChallenge = async (userId, challengeId) => {
  const query = `
                  SELECT
                      c.challenge_name
                      ,c.valid_from_datetime
                      ,c.valid_to_datetime
                      ,uc.user_score
                      ,uc.is_completed
                  FROM tbl_user u
                  INNER JOIN tbl_user_challenge uc              ON u.user_id = uc.user_id
                  INNER JOIN tbl_challenge c                    ON uc.challenge_id = c.challenge_id
                  WHERE
                      u.deactivated_datetime IS NULL
                      AND u.user_id = ?
                      AND c.challenge_id = ?
  `;
  return await mysql.query(query, [userId, challengeId]);
};

exports.insertUserChallenge = async (userId, challengeId) => {
  const checkQuery = `
                        SELECT
                            uc.challenge_id
                        FROM tbl_user_challenge uc      
                        WHERE
                            uc.user_id = ?
                            AND uc.challenge_id = ?
  `;
  const checkRes = await mysql.query(checkQuery, [userId, challengeId]);
  if (checkRes[0] != undefined) return ["User already signed up"];
  const query = `
                  INSERT INTO tbl_user_challenge(user_id, challenge_id)
                  VALUES
                      (?, ?)
  `;
  const { affectedRows: res } = await mysql.query(query, [userId, challengeId]);
  return res;
};

exports.deleteUserChallenge = async (userId, challengeId) => {
  const query = `
                  DELETE FROM tbl_user_challenge
                  WHERE
                      user_id = ?
                      AND challenge_id = ?
  `;
  const { affectedRows: res } = await mysql.query(query, [userId, challengeId]);
  if (res == 0) return "";
  else return res;
};

exports.updateUserChallenge = async (params, userId, challengeId) => {
  const query = `
  UPDATE tbl_user_challenge uc
  INNER JOIN(
              SELECT
                  ucx.user_challenge_id
                  ,ucx.user_score + ? AS score_to_set
                  ,?                 AS is_ch_completed
              FROM tbl_user_challenge ucx
              WHERE
                ucx.user_id = ?
                AND ucx.challenge_id = ?
  )x                                                        ON uc.user_challenge_id = x.user_challenge_id
  SET 
    user_score = x.score_to_set
    ,is_completed = x.is_ch_completed
  `;
  const { affectedRows: res } = await mysql.query(query, [
    params.scoresToAdd,
    params.setCompleted,
    userId,
    challengeId,
  ]);
  if (res == 0) return "";
  else return res;
};
