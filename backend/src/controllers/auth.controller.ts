import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service.js';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.loginUser(email, password);
    res.status(200).json({ message: "Đăng nhập thành công", ...data });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const data = await AuthService.googleLoginUser(token);
    res.status(200).json({ message: "Đăng nhập thành công", ...data });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export const facebookLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const data = await AuthService.facebookLoginUser(token);
    res.status(200).json({ message: "Đăng nhập thành công", ...data });
  } 
  catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export const hustLogin = async (req: Request, res: Response) => {
  try {
    const {taikhoan, matkhau} = req.body;
    const data = await AuthService.hustLoginUser(taikhoan, matkhau);
    res.status(200).json({ message: "Đăng nhập thành công", ...data })
  }
  catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await AuthService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try{
    const { id } = req.params;

    await AuthService.removeUser(Number(id));
    res.status(200).json({ message: `Xóa người dùng thành công` });
  }
  catch (error: any) {
    res.status(500).json({ error: "Lỗi khi xóa người dùng hoặc id không tồn tại" });
  }
};