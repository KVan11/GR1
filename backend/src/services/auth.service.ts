import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const registerUser = async (userData: any) => {
  // 1. Băm mật khẩu
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // 2. Lưu vào DB (Giả sử bạn đã có bảng User trong schema.prisma)
  return await prisma.user.create({
    data: {
      email: userData.email,
      username: userData.username,
      password: hashedPassword,
      role_id: 2 // Giả định 2 là ID của Role 'User'
    }
  });
};

export const loginUser = async (email: string, password: string) => {
  // 1. Tìm user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Email không tồn tại");

  // 2. Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Mật khẩu sai");

  // 3. Tạo Token
  const token = jwt.sign({ userId: user.id, roleId: user.role_id }, JWT_SECRET, { expiresIn: '1d' });
  
  return { token, user: { email: user.email } };
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      created_date: true,
      role: {
        select: {
          role_name: true
        }
      }
    }
  })
}

export const deleteUser = async (userId: number) => {
  return await prisma.user.delete({ where: { id: userId } });
}