require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRouter = require("./modules/users/usersRouter");
const isAuthenticated = require("./middlewares/auth")
const postsRouter = require("./modules/posts/postsRouter");
const commentsRouter = require("./modules/comments/commentsRouter");

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(bodyParser.json())
app.use(cookieParser());

app.use((req, res, next) => {

    const origin = req.headers.origin || "*";
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Contxprol-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next();
});


app.use((req, res, next) => {
    console.log(req.originalUrl, "\t", req.method, "\t", req.url);
    next();
});

app.use("/users", userRouter);
app.use("/posts", isAuthenticated, postsRouter);
app.use("/comments", isAuthenticated, commentsRouter);

app.get("/", (req, res) => {
    res.send("Hello world");
});
