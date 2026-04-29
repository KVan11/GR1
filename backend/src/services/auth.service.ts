import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      role_id: 2
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

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role.role_name,
      permissions,
    },
  };
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
export const googleLoginUser = async (credential: string) => {
  if (!credential) {
    throw new Error('Thiếu token Google');
  }

  // const { OAuth2Client } = await import('google-auth-library');
  // const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await googleClient.verifyIdToken({
    idToken: credential, 
    audience: process.env.GOOGLE_CLIENT_ID,
  }as any);

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Không lấy được email từ Google hoặc xác thực thất bại');
  }

  const email = payload.email;
  const name = payload.name;
  let user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user) {
    const username = (name || email.split('@')[0] || 'User').trim();
    const hashedPassword = await bcrypt.hash(`google-${email}-${Date.now()}`, 10);

    user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role_id: 2,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  const permissions = user.role.permissions.map((p) => p.permission_name);
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role.role_name,
      permissions,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role.role_name,
      permissions,
    },
  };
};

export const removeUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};