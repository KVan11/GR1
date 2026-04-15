import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const registerUser = async (userData: any) => {
  if (!userData?.email || !userData?.username || !userData?.password) {
    throw new Error('Thiếu email, username hoặc password');
  }

  // 1. Băm mật khẩu
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // 2. Lưu vào DB (Giả sử bạn đã có bảng User trong schema.prisma)
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      username: userData.username,
      password: hashedPassword,
      role_id: 2 // Giả định 2 là ID của Role 'User'
    },
    select: {
      id: true,
      email: true,
      username: true,
      role_id: true
    }
  });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ 
    where: {email},
    include: {
      role: {
        include: {
          permissions: true
        }
      }
    }
  });

  if (!user) throw new Error('Email không tồn tại');

  //kiem tra mat khau
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Mật khẩu sai');

  const permissions = user.role.permissions.map(p => p.permission_name);

  // Tạo token JWT
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role.role_name,
      permissions: permissions
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user: { email: user.email, permissions } };
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
export const removeUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};