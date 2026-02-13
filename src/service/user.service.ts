
import { getConnection } from "config/database";

import { prisma } from 'config/client';
import { ACCOUNT_TYPE,TOTAL_ITEMS_PER_PAGE } from "config/constants";
import bcrypt, { compare } from 'bcrypt';
const saltRounds = 10;


const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

const handerCreateUser =
  async (fullname: string,
    username: string,
    address: string,
    phone: string,
    avatar: string,
    role: string
  ) => {

    const password = await hashPassword('123456');
    await prisma.user.create({
      data: {
        fullName: fullname,
        username: username,
        address: address,
        phone: phone,
        password: password,
        accountType: ACCOUNT_TYPE.SYSTEM,
        avatar: avatar,
        roleId: +role
      }
    }
    )


  }




const handerUpdateUser =
  async (
    id: string,
    fullname: string,
    address: string,
    phone: string,
    avatar: string,
    role: string
  ) => {


    await prisma.user.update({
      where: { id: +id },
      data: {
        fullName: fullname,
        address: address,
        phone: phone,
        accountType: ACCOUNT_TYPE.SYSTEM,
        ...(avatar !== undefined && { avatar: avatar }),
        roleId: +role,
      },
    });


  }



const getAllUsers = async (page: number = 1) => {
  const pageSize = TOTAL_ITEMS_PER_PAGE; // 1ページあたりのユーザー数
  const skip = (page - 1) * pageSize;

  const users = await prisma.user.findMany({
    skip: skip,
    take: pageSize
  });
  return users;

}

const  countTotalPagesUser = async () => {
  const totalUsers = await prisma.user.count();
  return Math.ceil(totalUsers / TOTAL_ITEMS_PER_PAGE);
}



const deleteUserById = async (userId: string) => {

  try {
    const id = Number(userId);

    const user = await prisma.user.delete({
      where: { id },
    });

    return user; // 見つからなければ null
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}



const getUserById = async (userId: string) => {
  try {
    const id = Number(userId);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user; // 見つからなければ null
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }



}

const getAllRoles = async () => {

  const users = await prisma.role.findMany();
  return users;

}

export { handerCreateUser, getAllUsers, deleteUserById, getUserById, getAllRoles, 
  hashPassword, handerUpdateUser ,comparePassword, countTotalPagesUser};