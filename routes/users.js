const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User, postUsersSchema, postLoginSchema }
= require("../schemas/user");

router.post("/auth", async (req, res) => {
  try {
    var { userId, password } = await postLoginSchema.validateAsync(req.body);
  } catch {
    return res.status(402).send({
      errorMessage: '아이디나 패스워드가 유효하지 않습니다.',
    });
  }

  const user = await User.findOne({ userId }).exec();

  if (!user) {
    return res.status(401).send({
      errorMessage: "아이디나 비밀번호가 잘못 됐습니다.",
    });
  }

  const hashedPassword = bcrypt.compareSync(password, user.password);

  if (hashedPassword) {
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY);
    return res.status(200).send({
      result: "success",
      token,
      nickname: user.nickname
    });
  } else {
    return res.status(400).send({
      errorMessage: "아이디나 비밀번호가 잘못 됐습니다."
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
      name
    } = await postUsersSchema.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send({
      errorMessage: '입력조건이 맞지 않습니다.'
    })
  };

  const oldUser = await User.find({ $or: [{ userId }, { nickname }], });

  if (oldUser.length) {
    return res.status(400).send({
      errorMessage: '중복된 이메일 또는 닉네임입니다.',
    });
  }

  const { passwordCheck } = req.body;

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
  } catch {
    return res.status(400).send({
      errorMessage: '회원가입에 실패하였습니다.'
    })
  }

  res.status(200).send({
    result: "success",
  });
});


router.post("/nodemailerTest", function(req, res, next){
  let email = req.body.email;
  
  //랜덤 6자리 숫자
  const generateRandom = function(min, max) {
    const randomNumber = Math.floor(Math.random() * (max-min+1)) + min;
    return randomNumber
}
const number = generateRandom(111111, 999999)

  let transporter = nodemailer.createTransport({
    service: 'gmail', //이메일 보내는 서비스 주소
    auth: {
      user: process.env.MAILS_EMAIL,  // gmail 계정 아이디를 입력
      pass: process.env.MAILS_PWD       // gmail 계정의 비밀번호를 입력
    }
  });

  let mailOptions = {
    from: process.env.MAILS_EMAIL,    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: email ,                     // 수신 메일 주소
    subject: "[읏챠 피디아] 인증번호가 도착했습니다.",   // 제목
    html: 
        "<h2>읏챠 피디아 인증 번호입니다</h2>"+ 
        "아래의 인증번호를 입력하여 주세요<br>"+
         number, //내용
  };

 transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }else{
    console.log('이메일 발송 성공');
    transporter.close();
    }
  });
});

module.exports = router;