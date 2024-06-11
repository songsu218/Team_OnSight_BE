const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

//회원가입 요청
router.get('/register/:emailId/:nick/:password', (req, res) => {
  const { emailId, nick, password } = req.params;
  res.send(`${emailId}, ${nick}, ${password}`);
  console.log(emailId, nick, password);
  //   try {
  //     const userDoc = await User.create({});
  //     console.log(userDoc);
  //   } catch (e) {}
});

module.exports = router;
