import e, { Request, Response } from 'express';
import { handerGetAllUsers } from 'service/client/api.service';
import { addProductToCart } from 'service/client/item.service';


const postAddProductToCartAPI =async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const user = req.user; // ユーザーIDを取得（認証が必要な場合）
    // ここで、カートに商品を追加するロジックを実装します。
    // 例えば、セッションやデータベースを使用してカート情報を管理することができます。
    const currentSum = req?.user?.sumCart ?? 0; 
    const newSum = currentSum + (+quantity); // 例: カートの合計金額を更新
    await addProductToCart(+quantity, +productId, user);

    
    return res.status(200).json({ data:  newSum });

}

const getAllUseAPI =async (req: Request, res: Response) => {
    const user = await handerGetAllUsers(req, res); // ユーザーIDを取得（認証が必要な場合）
    
    return res.status(200).json({ data:  user });

}

export { postAddProductToCartAPI, getAllUseAPI };

