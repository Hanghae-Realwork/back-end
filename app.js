const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");

const usersRouter = require("./routes/users");
const projectsRouter = require("./routes/projects");
const resumesRouter = require("./routes/resumes");
const port = 3000;
require("dotenv").config()

app.use(cors({
    // exposedHeaders:["authorization"],
    origin: '*',
    credentials: 'true',
  }));

app.use(
    helmet({ contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: false,
          }),
);
app.use(express.json()); 
app.use(express.urlencoded({extended:false}));
app.use("/api/users", [usersRouter]);
app.use("/api/projects", [projectsRouter]);
app.use("/api/resumes", [resumesRouter]);

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌습니다.");
});
