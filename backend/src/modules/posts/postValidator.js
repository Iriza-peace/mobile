const { z } = require('zod');

// Define the validation schema
const postSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }).optional(),
  content: z.string().min(10, { message: "Content must be at least 25 characters long" }).optional(),
  userId: z.string().uuid({ message: "Invalid user ID" }).optional(),
});

const validatePost = (data) => {
    const post = postSchema.safeParse(data);
    if (!post.success) {
        throw new Error(post.error.errors[0].message);
    }
    return post.data;
};


// Export the validation schema

module.exports = {
    validatePost
}


