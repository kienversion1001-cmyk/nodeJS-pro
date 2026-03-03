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


export { handerGetAllUsers, handerGetUserById,handerUpdateUserById,handerDeleteUserById };