const express = require("express");
const commentsController = require("./commentsController");
const router = express.Router();

router.post("/", commentsController.createComment);
router.get("/", commentsController.getCommentsByPostId);

module.exports = productsRouter;