// commentValidator.js
const { z } = require('zod');

const commentSchema = z.object({
    content: z.string(),
    postId: z.string(),
});

const validateComment = (data) => {
    const result = commentSchema.safeParse(data);
    if (!result.success) {
        throw new Error(result.error.errors[0].message);
    }
    return result.data;
};

module.exports = {
    validateComment
};