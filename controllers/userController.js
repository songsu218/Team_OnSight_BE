const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

//회원가입 요청
router.get('/register/:emailId/:nick/:password', async (req, res) => {
  const { emailId, nick, password } = req.params;
  const userData = { emailId, nick, password };
  console.log(userData);

  try {
    const newUser = await userService.register(userData);
    res.status(200).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
