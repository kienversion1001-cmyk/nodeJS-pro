import { prisma } from "config/client";
import { Request, Response } from "express";



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

export { handerGetAllUsers, handerGetUserById };