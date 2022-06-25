const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Resume = require("../models/resume");

// 개발자 정보 등록
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, content2, content3, skills, email, phone } = req.body;
    const start = new Date();
    const end = new Date();
    // const now = new Date();
    // const date = now.toLocaleDateString("ko-KR");
    // const hours = now.getHours();
    // const minutes = now.getMinutes();
    // const postDate = date + " " + hours + ":" + minutes;
    const dev = await Resume.create({ title, content, content2, content3, start, end, skills, email, phone });
    res.status(200).send({ dev, message: "나의 정보를 등록 했습니다." });
  } catch (error) {
    console.log(error);
    res.status(400).send({ errormessage: "작성란을 모두 기입해주세요." });
  }
});

// 개발자 정보 조회
router.get("/", authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.status(200).send({ resumes });
  } catch (error) {
    console.log(error);
    res.status(400).send({});
  }
});

// 개발자 상세조회
router.get("/:resumeId", authMiddleware, async (req, res) => {});

// 개발자 정보 수정
router.put("/:resumeId", authMiddleware, async (req, res) => {});

// 개발자 정보 삭제
router.delete("/:resumeId", authMiddleware, async (req, res) => {});

module.exports = router;
