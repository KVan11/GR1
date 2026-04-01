import { Router } from 'express';
import { register, login, getUsers, deleteUser } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkAdmin } from '../middlewares/admin.middleware.js';

const router = Router();
/**
 * @swagger
 * /tags:
 *  name: Auth
 *  description: API xach thuc nguoi dung
 */

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *   summary: Dang ky tai khoan moi
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        username:
 *         type: string
 *        email:
 *         type: string
 *        password:
 *         type: string
 *   responses:
 *    201:
 *     description: Nguoi dung duoc tao thanh cong
 *    400:
 *     description: Du lieu dau vao khong hop le
 */
router.post('/register', register);    // URL: http://localhost:3000/api/auth/register

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *   summary: Dang nhap tai khoan
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       properties:
 *        email:
 *         type: string
 *        password:
 *         type: string
 *   responses:
 *    200:
 *     description: Dang nhap thanh cong
 *    401:
 *     description: Sai mat khau hoac email khong ton tai
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/users:
 *  get:
 *   summary: Lay danh sach toan bo nguoi dung
 *   tags: [Auth]
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Tra ve danh sach nguoi dung
 *    401:
 *     description: Khong co quyen truy cap do khong dang nhap hoac token khong hop le
 */
router.get('/users',verifyToken, checkAdmin, getUsers);

/**
 * @swagger
 * /api/auth/users/{id}:
 *  delete:
 *   summary: Xoa nguoi dung
 *   tags: [Auth]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *       description: ID cua nguoi dung can xoa
 *   responses:
 *    200:
 *     description: Xoa nguoi dung thanh cong
 *    403:
 *     description: Ban khong co quyen truy cap do khong dang nhap hoac token khong hop le
 *    404:
 *     description: Khong tim thay nguoi dung voi ID da cho
 *    500:
 *     description: Loi server khi xoa nguoi dung
 */
router.delete('/users/:id', verifyToken, checkAdmin, deleteUser);

export default router;