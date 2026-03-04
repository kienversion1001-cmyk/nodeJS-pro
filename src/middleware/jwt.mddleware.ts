import { Request,Response,NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { any } from "zod";
const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {

    const path=req.path;
    const whileList = ["/login", "/add-product-to-cart"]; // JWT検査をスキップするパスのリスト

    const isWhiteListed = whileList.some((whitePath) => whitePath === path);

    if (isWhiteListed) {
        return next(); // JWT検査をスキップして次のミドルウェアへ
    }


    const token = req.headers['authorization']?.split(' ')[1]; // format: Bearer <token>
     

     try {
  const dataDeCoded = jwt.verify(token || "", process.env.JWT_SECRET!) as JwtPayload;
  console.log("Decoded JWT data:", dataDeCoded); // デコードされたデータをログに出力
req.user  = {
     id: dataDeCoded.id ,
    username: dataDeCoded.username,
    password: "",
    fullName:  "",
    address:"",
    phone: "",
    accountType: dataDeCoded.accountType,
    avatar: dataDeCoded.avatar,
    roleId: dataDeCoded.roleId,
    role: dataDeCoded.role 
    
}; // これで次のミドルウェアやルートハンドラーで user データが使えるようになる
} catch (error) {
 
  // 必要ならここで return / throw / レスポンス返却
  return res.status(401).json({ error: "Invalid or expired token" });
}

     next();
}
export {
    checkValidJWT
}
                    