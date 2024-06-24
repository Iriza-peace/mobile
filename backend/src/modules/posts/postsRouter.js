const express = require("express");
const PostsController = require("./postsController");
const router = express.Router();

router.post("/",PostsController.createPost);
router.get("/",PostsController.getPosts);
router.get("/:id", PostsController.getPostById);
router.put("/:id", PostsController.updatePost);
router.delete("/:id", PostsController.deletePost);

const postsRouter = router;
module.exports = postsRouter;


