import { Request, Response } from 'express';
import * as PostService from '../services/post.service.js';

export const createPost = async (req: Request, res: Response) => {
    try {
        const userId = Number((req as any).user?.userId);
        if (!userId) {
            return res.status(401).json({ error: "Token không hợp lệ: thiếu userId" });
        }

        const post = await PostService.createPost(userId, req.body);
        res.status(201).json({ message: "Tạo bài viết thành công", post });
    }
    catch (error: any) {
        console.error("Lỗi Create Post:", error.message);
        res.status(400).json({ error: error.message });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.id);
        const userId = Number((req as any).user.userId);

        const result = await PostService.updatePost(postId, userId, req.body);
        res.status(200).json ({ message: "Cập nhật bài viết thành công", post: result });
    }
    catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await PostService.getAllPosts();
        res.status(200).json(posts);
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.id);
        const userId = Number((req as any).user.userId);

        await PostService.deletePost(postId, userId);
        res.status(200).json({ message: "Xóa bài viết thành công" });
    }
    catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};