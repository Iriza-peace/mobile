const { validatePost } = require('./postValidator');
const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

async function createPost(req, res) {
    try {
        //Validate the post data from the request body
        const postData = validatePost(req.body);
        console.log("Post Data:", postData);

        // //Assuming req.user contains the userId, find the author
        // const authorId = req.id; // Ensure this is correctly set to the userId
      
        // console.log("User ID:", req.user);
        
        const author = await prismaClient.user.findUnique({
            where: {
               id: "clxsp82nm0000148cbm59w2js"

            }
        });

        // Log the author to see if it is working
        console.log("Author:", author);

        // If the author does not exist, return a 404 error
        if (!author) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        


        // Create the new post with the validated data and associate it with the author
        const newPost = await prismaClient.posts.create({
            data: {
                ...postData,
                userId: author.id // Use userId to connect the post to the author
            }
        });

        // Return the newly created post
        res.status(201).json({
            success: true,
            post: newPost
        });

    } catch (error) {
        console.error(error); // Use console.error for better error visibility
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getPosts(req, res) {
    try {
        const posts = await prismaClient.posts.findMany({
            include: {
                author: true
            }
        });
        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getPostById(req, res) {
    try {
        const postId = req.params.id;
        const post = await prismaClient.posts.findUnique({
            where: {
                id: postId
            },
            include: {
                author: true,
                Comment: true // Include comments associated with the post
            }
        });
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }
        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function updatePost(req, res) {
    try {
        const postId = req.params.id;
        const post = validatePost(req.body);

        const existingPost = await prismaClient.posts.findUnique({
            where: {
                id: postId
            }
        });
        if (!existingPost) {
            return res.status(404).json({
                message: "Post not found"
            });
        }
        if (existingPost.userId !== req.user) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        const updatedPost = await prismaClient.posts.update({
            where: {
                id: postId,
            },
            data: post
        });

        res.status(200).json({
            success: true,
            updatedPost
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.id;

        const post = await prismaClient.posts.delete({
            where: {
                id: postId
            }
        });
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }
        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
};