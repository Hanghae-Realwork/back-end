const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  birth: {
    type: String,
    required: true
  }
});

const postUsersSchema = Joi.object({
  userId: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  nickName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{3,20}$")).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{4,20}$")).required(),
  passwordCheck: Joi.string().pattern(new RegExp("^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{4,20}$")).required(),
  phone: Joi.string().pattern(new RegExp(/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/)).required(),
  birth: Joi.string().pattern(new RegExp(/^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/)).required(),
  name: Joi.string().pattern(new RegExp(/[^a-zA-Zㄱ-ㅎ?가-힣]{3,8}$/)).required()
});
// 비밀번호 영문숫자특수문자 포함 4~20자
const postLoginSchema = Joi.object({
  userId: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{4,20}$")).required(),
});


module.exports = {
  User: mongoose.model("User", UserSchema),
  postUsersSchema,
  postLoginSchema,
}