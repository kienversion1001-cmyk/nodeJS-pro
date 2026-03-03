import e, { Request, Response } from 'express';
import { handerDeleteUserById, handerGetAllUsers, handerGetUserById, handerUpdateUserById } from 'service/client/api.service';
import { registerNewUser } from 'service/client/auth.service';
import { addProductToCart } from 'service/client/item.service';
import { registerSchema, TRegisterSchema } from 'validation/register.schema';


const postAddProductToCartAPI = async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const user = req.user; // ユーザーIDを取得（認証が必要な場合）
    // ここで、カートに商品を追加するロジックを実装します。
    // 例えば、セッションやデータベースを使用してカート情報を管理することができます。
    const currentSum = req?.user?.sumCart ?? 0;
    const newSum = currentSum + (+quantity); // 例: カートの合計金額を更新
    await addProductToCart(+quantity, +productId, user);


    return res.status(200).json({ data: newSum });

}

const getAllUseAPI = async (req: Request, res: Response) => {
    const user = await handerGetAllUsers(); // ユーザーIDを取得（認証が必要な場合）

    return res.status(200).json({ data: user });

}
const getUseByIdAPI = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await handerGetUserById(+id); // ユーザーIDを取得（認証が必要な場合）

    return res.status(200).json({ data: user });

}
const createUserAPI = async (req: Request, res: Response) => {
    const { fullname, email, password } = req.body as TRegisterSchema;

    const validate = await registerSchema.safeParseAsync(req.body);

    if (!validate.success) {
        const errors = validate.error.issues.map((item) => ({
            field: String(item.path[0] ?? ""),
            message: item.message,
        }));


        return res.status(400).json({
            ok: false,
            message: "Validation error",
            errors,   // [{ field, message }, ...]
            // 入力値を返したい場合（通常は password は返さない方が安全）
        });
    }

    // TODO: ここに登録処理
    // const user = await userService.create(...)
    await registerNewUser(fullname, email, password);
    return res.status(201).json({
        ok: true,
        data: "Registered",
        // user: { ...必要なら }
    });


}


const updateUseByIdAPI = async (req: Request, res: Response) => {
    const { fullname, address, phone } = req.body;
    const { id } = req.params;


    // const avatar = file ? file.filename : '';

    await handerUpdateUserById(+id, fullname, address, phone);
    //  console.log('>>> check created user: ', a);  

    return res.status(200).json({
        data: "User updated successfully"
    });

}

const deleteUseByIdAPI = async (req: Request, res: Response) => {
    
    const { id } = req.params;


      await handerDeleteUserById(+id);

    return res.status(200).json({
        data: "User deleted successfully"
    });

}

export { postAddProductToCartAPI, getAllUseAPI, getUseByIdAPI, createUserAPI, updateUseByIdAPI
    ,deleteUseByIdAPI
 };

