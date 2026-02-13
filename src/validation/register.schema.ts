import { z } from 'zod';
import { prisma } from 'config/client';
import { isEmailExist } from 'service/client/auth.service'


const passwordSchema = z.string()
    .min(3, "Password must be at least 8 characters")
    .max(10, "Password too long")
    // .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    // .regex(/[0-9]/, "Password must contain at least 1 number")
    // .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character");

const emailSchema =
    z.string().email("無効なメールアドレス").refine(async (email) => {
        const user = await isEmailExist(email)
        return !user;
    },

        {
            message: "このメールアドレスは既に使用されています",
            path: ["email"]
        }


    )


export const registerSchema = z.object({
    fullname: z.string().min(1, "fullname is required"),
    email: emailSchema,                      // ← emailSchema を使用
    password: passwordSchema,                // ← passwordSchema を使用
    confirmPassword: z.string(),         // 同じルールを適用
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password and Confirm Password do not match",
        path: ["confirmPassword"],
    });





export type TRegisterSchema = z.infer<typeof registerSchema>;

