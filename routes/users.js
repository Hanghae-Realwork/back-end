const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User, postUsersSchema, postLoginSchema }
= require("../models/user");

router.post("/auth", async (req, res) => {
  try {
    var { userId, password } = await postLoginSchema.validateAsync(req.body);
  } catch {
    return res.status(400).send({
      errorMessage: '아이디 또는 패스워드가 유효하지 않습니다.',
    });
  }

  const user = await User.findOne({ userId }).exec();

  if (!user) {
    return res.status(401).send({
      errorMessage: "존재하지 않는 유저입니다.",
    });
  }

  const hashedPassword = bcrypt.compareSync(password, user.password);

  if (hashedPassword) {
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY);
    return res.status(200).send({
      message : "로그인 하셨습니다." ,
      token
    });
  } else {
    return res.status(400).send({
      errorMessage: "아이디나 또는 비밀번호가 일치하지 않습니다."
    });
  }

});

router.post("/signup", async (req, res) => {
  try {
    var {
      userId,
      nickname,
      password,
      phone,
      birth,
      name,
      passwordCheck
    } = await postUsersSchema.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send({
      errorMessage: '작성 형식을 확인해주세요.'
    })
  };

  if(userId || nickname || password || phone || birth || name || passwordCheck === "") {
    res.status(400).send({ errorMessage : "작성란을 모두 기입해주세요."})
  }


  const oldUser = await User.find({ userId, nickname });

  if (oldUser.length) {
    return res.status(  400).send({
      errorMessage: '중복된 아이디 또는 닉네임입니다.',
    });
  }

  if( password !== passwordCheck) {
    res.status(400).send({
      errorMessage: '비밀번호가 일치하지 않습니다.'
    })
    return;
  }


  try {
    const hash = bcrypt.hashSync(password, 10);
    const user = new User({ userId, password: hash, nickname, birth, phone, name });
    user.save();
    res.status(200).send({ message : "회원가입을 축하합니다."});
  } catch {
    return res.status(400).send({
      errorMessage: '회원가입에 실패하였습니다.'
    })
  }

});



module.exports = router;
