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

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await AuthService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};