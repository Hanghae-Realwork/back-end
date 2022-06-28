const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { Project, projectPostSchema } = require("../models/project");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "jerryjudymary",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, "projectImage/" + Date.now() + "." + file.originalname.split(".").pop()); // 이름 설정
    },
  }),
});

const createdAt = new Date().toLocaleString('ko-KR'); // 전역변수로 시간 설정

// 프로젝트 등록

router.post("/", authMiddleware, upload.array("photos"), async (req, res) => {
  if (!res.locals.user) {
    res.status(401).json({ errorMessage: "로그인 후 사용하세요." });
  } else {
    const { userId } = res.locals.user

    try {
      var {
        title, details, subscript, role, start, end, skills, email, phone,
      } = await projectPostSchema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ errorMessage: "작성 형식을 확인해주세요." });
    }

    if (!title || !details || !subscript || !role || !start || !end || !skills || !email || !phone) {
      res.status(400).json({ errorMessage: "작성란을 모두 기입해주세요." });
    }

  const imageReq = req.files; // 복수 선택 이미지 URI 배열화

  let imageArray = [];
  function LocationPusher() {
    for (let i = 0; i < imageReq.length; i++) {
      imageArray.push(imageReq[i].location);
    }
    return imageArray;
  }

  const photos = LocationPusher();

  // -- 별도 라이브러리 설치 없이 projectId 임시 시퀀싱

  const projectExist = await Project.find().sort("-projectId").limit(1);
  let projectId;

  if (projectExist.length) {
    projectId = projectExist[0]["projectId"] + 1;
  } else {
    projectId = 1;
  }

  // --

  await Project.create({
    title, details, subscript, role, start, end,
    skills, photos, email, phone, userId,
    projectId, photos, createdAt,
  });

  res.status(200).json({ message: "프로젝트 게시글을 작성했습니다." });
  };
});

// 프로젝트 조회

router.get("/", async (req, res) => {
  const projects = await Project.find().sort({ projectId: -1 }); // 최근 등록순으로 나열
  res.send({ projects });
});

// 프로젝트 상세 조회

router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findOne({ projectId: projectId });
  res.status(200).json({ project });
});

// 프로젝트 수정

router.put("/:projectId", authMiddleware, upload.array("photos"), async (req, res) => {
  if (!res.locals.user) {
    res.status(401).json({ errorMessage: "로그인 후 사용하세요." });
  } else {

  const { userId } = res.locals.user;
  const { projectId } = req.params;
  const existProject = await Project.findOne({ projectId: projectId });

  try {
    var {
      title, details, subscript, role, start, end, skills, email, phone,
    } = await projectPostSchema.validateAsync(req.body);
  } catch (err) {
    return res.status(400).json({ errorMessage: "작성 형식을 확인해주세요." });
  }

  if (!title || !details || !subscript || !role || !start || !end || !skills || !email || !phone) {
    res.status(400).json({ errorMessage: "작성란을 모두 기입해주세요." });
  }

  const imageReq = req.files; // -- 복수 선택 이미지 URI 배열화

  let imageArray = [];
  function LocationPusher() {
    for (let i = 0; i < imageReq.length; i++) {
      imageArray.push(imageReq[i].location);
    }
    return imageArray;
  }

  // --

  const photos = LocationPusher();

  if (userId === existProject.userId) {
    if (existProject) {
      await Project.updateOne({ projectId: projectId }, {
        $set: { title, details, subscript, role, start, end, skills, email, phone, photos }
      });
      res.status(200).json({
        message: "프로젝트 게시글을 수정했습니다.",
      });
      } else {
        res.status(400).send({ errorMessage: "게시물 수정 실패." });
      }
    } else {
      res.status(401).send({ errorMessage: "로그인 후 사용하세요." });
    };
  };
});

// 프로젝트 삭제

router.delete("/:projectId", authMiddleware, async (req, res) => {
  if (!authMiddleware) {
    res.status(401).json({ errorMessage: "로그인 후 사용하세요." });
  }

  const { projectId } = req.params;
  const user = res.locals.user;
  const userId = user.userId;
  const existProject = await Project.findOne({ projectId: parseInt(projectId) });

  if (userId === existProject.userId) {
    if (existProject) {
      await Project.deleteOne({ projectId: parseInt(projectId) });
      res.status(200).send({ message: "프로젝트 게시글을 삭제했습니다." });
    } else {
      res.status(400).send({ errorMessage: "작성자만 삭제할 수 있습니다." });
    }
  }
});

module.exports = router;

// 이미지 업로드

/*
router.post('/images', authMiddleware, upload.array('image'), async (req, res) => {

    try {

        const imageReq = req.files;
        let imageArray = [];
    
        function LocationPusher() {
            for (let i = 0; i < imageReq.length; i++) {
                imageArray.push(imageReq[i].location);
            } return imageArray;
        };

        const image = LocationPusher();
        res.status(200).json({ message : '사진을 업로드 했습니다.', image });

    } catch (err) {

      res.status(400).send({ errorMessage : '사진업로드 실패-파일 형식과 크기(1.5Mb 이하) 를 확인해주세요.' });

    };

}); */
