const jwt = require("jsonwebtoken");
const {User, Object} = require("../models/user.js");
require("dotenv").config();

module.exports = (req, res, next) => {
    console.log("=========middleware=============");

    const { authorization } = req.headers; 

    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType !== 'Bearer') {
      return res.status(401).send({
          errorMessage: "로그인이 필요한 기능입니다.",
      });
    }

    try {
      const { userId } = jwt.verify(tokenValue, process.env.JWT_SECRET_KEY);

      User.findOne({ userId }).exec().then((user) => {
          res.locals.user = user;
          next();
      });
    } catch (error) {
      return res.status(401).send({
          errorMessage: "로그인이 필요한 기능입니다.",
      });
    }
};