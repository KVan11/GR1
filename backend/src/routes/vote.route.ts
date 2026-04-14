import { Router } from 'express';
import { votePost} from '../controllers/vote.controller.js';
import { verifyToken, checkPermission } from '../middlewares/auth.middleware.js';

const router = Router();
/**
 * @swagger
 * /tags:
 *  name: Vote
 *  description: API quản lý bình chọn bài viết
 */

/**
 * @swagger
 * /api/vote/post/{id}:
 *  patch:
 *   summary: Bình chọn bài viết
 *   tags: [Vote]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *       description: ID của bài viết cần bình chọn
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        point:
 *         type: integer
 *         description: Số điểm muốn bình chọn
 *        tag_name:
 *         type: string
 *         description: Tên tag muốn bình chọn
 *   responses:
 *    200:
 *     description: Bình chọn thành công
 *    400:
 *     description: Dữ liệu đầu vào không hợp lệ hoặc lỗi khi xử lý bình chọn
 */
router.patch('/post/:id', verifyToken, checkPermission('VOTE_POST'), votePost);

export default router;