import e, { Router } from 'express';
import { createPost, getPosts } from '../controllers/post.controller.js';
import { verifyToken, checkPermission } from '../middlewares/auth.middleware.js';
import { deletePost } from '../controllers/post.controller.js';

const router = Router();

/**
 * @swagger
 * /tags:
 *  name: Post
 *  description: API quản lý bài viết
 */

/**
 * @swagger
 * /api/post:
 *  post:
 *   summary: Tạo bài viết mới
 *   tags: [Post]
 *   security:
 *     - bearerAuth: []
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *             categoryIds:
 *               type: array
 *               items:
 *                 type: number
 *             tag_list:
 *               type: string
 *             expired_time:
 *               type: string
 *               format: date-time
 *   responses:
 *     201:
 *       description: Bài viết được tạo thành công
 *     400:
 *       description: Dữ liệu đầu vào không hợp lệ
 */
router.post('/', verifyToken, checkPermission('POST_CREATE'),createPost);

/**
 * @swagger
 * /api/post:
 *  get:
 *   summary: Lấy danh sách tất cả bài viết
 *   tags: [Post]
 *   responses:
 *    200:
 *     description: Trả về danh sách bài viết
 *    500:
 *     description: Lỗi server
 */
router.get('/', getPosts);

/**
 * @swagger
 *   /api/post/{id}:
 *     delete:
 *       summary: xóa bài viết
 *       tags: [Post]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: ID của bài viết cần xóa
 *       responses:
 *         200:
 *           description: Xóa bài viết thành công
 *         400:
 *           description: Lỗi khi xóa bài viết (bài viết không tồn tại hoặc không có quyền xóa)
 */
router.delete('/:id', verifyToken, checkPermission('POST_DELETE'), deletePost);

export default router;