
import { Request, Response,NextFunction } from 'express';
import { register } from 'module';
import { TRegisterSchema, registerSchema } from 'validation/register.schema'
import { registerNewUser } from 'service/client/auth.service'

const getLoginPage = (req: Request, res: Response) => {
    const {session}=req as any;
    const messages=session?.messages??[];
    return res.render('client/auth/login.ejs',{messages});
};

// 登録ページ表示
const getRegisterPage = (req: Request, res: Response) => {
    const errors: string[] = [];
    const oldData = {
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    };
    return res.render('client/auth/register.ejs', { errors, oldData });
};

const postRegister = async (req: Request, res: Response) => {
    const { fullname, email, password, confirmPassword } = req.body as TRegisterSchema;

    const validate = await registerSchema.safeParseAsync(req.body)

    if (!validate.success) {
        const errorZod = validate.error.issues;
        const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`)

        const oldData = {
            fullname,
            email,
            password,
            confirmPassword,
        };

        return res.render('client/auth/register.ejs', { errors, oldData });

    }

    await registerNewUser(fullname, email, password);
    return res.redirect('/login')




};


const postLogout = (req: Request, res: Response,next:NextFunction) => {
    req.logOut(function(err){
        if(err){return next(err)}
        res.redirect('/')
    })
};




export { getLoginPage, getRegisterPage, postRegister,postLogout }
