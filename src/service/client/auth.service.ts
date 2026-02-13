import { prisma } from 'config/client';
import { ACCOUNT_TYPE } from 'config/constants'
import { hashPassword, comparePassword } from 'service/user.service'
import { Request, Response } from 'express';

const isEmailExist = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { username: email },
  });

  return user !== null; // user が存在すれば true
};

const registerNewUser = async (
  fullname: string,
  email: string,
  password: string
) => {
  const newPassword = await hashPassword(password);
  const userRole = await prisma.role.findFirst({
    where: { name: "USER" },
  });

  if (userRole) {
    await prisma.user.create({
      data: {
        username: email,
        password: newPassword,
        fullName: fullname,
        accountType: ACCOUNT_TYPE.SYSTEM,
        roleId: userRole.id
      }

    }



    )
  } else {
    throw new Error("user role not exist")
  }



}

const handerLogin = async (username: string, password: string, callback: any) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  });
  if (!user) {

    return callback(null, false, { message: `ユーザー名 "${username}" は存在しません` })
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return callback(null, false, { message: 'パスワードが正しくありません' });

  }
  return callback(null, user);
}

const getUserWithRoleById = async (userId: string) => {
  try {
    const id = Number(userId);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
      omit: {
        password: true
      },
    });

    return user; // 見つからなければ null
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }

}

const getUserSumCart = async (userId: string) => {
  const user = await prisma.cart.findUnique({
    where: {
      userId: +userId
    }
  })

  return user?.sum ?? 0

}



const getSuccessRedirectPage = async (req: Request, res: Response) => {
  const user = req.user as any;

  if (user?.role?.name === "ADMIN") {
    res.redirect('/admin')
  } else {
    res.redirect("/")
  }




}

export { isEmailExist, registerNewUser, getUserWithRoleById, getSuccessRedirectPage, getUserSumCart }
