import { Request, Response } from 'express';
import * as VoteService from '../services/vote.service.js';

export const votePost = async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.id);
        const userId = Number((req as any).user.userId);
        const { point, tag_name } = req.body;

        if(!tag_name) {
            return res.status(400).json({ error: "Thiếu tag_name trong yêu cầu" });
        }

        const newTotalPoint = await VoteService.handleVote(postId, userId, point, tag_name);

        res.status(200).json({
            message: "Vote thành công",
            data: {
                postId: postId,
                tag_voted: tag_name, 
                total_point_of_post: newTotalPoint
            }
        });
    }
    catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}