import { prisma } from "config/client";
import { Request, Response } from "express";



const handerGetAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  return users;
}


export { handerGetAllUsers };