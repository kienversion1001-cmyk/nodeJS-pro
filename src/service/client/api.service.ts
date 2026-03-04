import { prisma } from "config/client";
import { Request, Response } from "express";
import { comparePassword } from "service/user.service";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { use } from "passport";




const handerGetAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
}
const handerGetUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  });
  return user;
}

const handerUpdateUserById = async (id: number, fullName: string, address: string, phone: string) => {
  const user = await prisma.user.update({
    where: {
      id: id
    },
    data: {
      fullName,
      address,
      phone
    }
  });
  return user;
}

const handerDeleteUserById = async (id: number) => {
  const user = await prisma.user.delete({
    where: {
      id: id
    }
  });
  return user;
}

const handlerUserLogin = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username
    },
    include: {
      role: true
    }
  });
  if (!user) {
    throw new Error(`ユーザー名 と パスワードが正しくありません`);
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error(`ユーザー名 と パスワードが正しくありません`);
  }

  const payload = {
    id: user.id,
    username: user.username,
    roleId:user.roleId,
    role: user.role,
    accountType: user.accountType,
    avatar: user.avatar 
  }
  const secretOrPrivateKey = process.env.JWT_SECRET || "your_jwt_secret_key";
  const expiresIn:any = process.env.JWT_EXPIRES_IN || "1h"; // 例: '1h', '2d', '10m' など
  const asscessToken = jwt.sign(payload, secretOrPrivateKey, {
    expiresIn: expiresIn
  })

return asscessToken
}







export { handerGetAllUsers, handerGetUserById, handerUpdateUserById, handerDeleteUserById, handlerUserLogin };