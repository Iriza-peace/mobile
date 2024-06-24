// commentController.js
const { validateComment } = require('./commentValidator');
const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

async function createComment(req, res) {
    try {
        const comment = validateComment(req.body);
        const postExists = await prismaClient.posts.findUnique({
            where: {
                id: comment.postId
            }
        });
        if (!postExists) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const newComment = await prismaClient.comment.create({
            data: {
                content: comment.content,
                postId: comment.postId
            }
        });

        res.status(201).json({
            success: true,
            comment: newComment
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
async function getCommentsByPostId(req, res) {
    try {
        const postId = req.params.postId;
        const comments = await prismaClient.comment.findMany({
            where: {
                postId: postId
            }
        });
        res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createComment,
    getCommentsByPostId
}

