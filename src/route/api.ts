
import { getAllUseAPI, getUseByIdAPI, createUserAPI,updateUseByIdAPI,
    loginAPI,deleteUseByIdAPI,postAddProductToCartAPI,fetchAccountAPI } from "controller/client/api.controller";
import express,{Express} from "express";
import { checkValidJWT } from "middleware/jwt.mddleware";

const router = express.Router();

const apiRouter = (app:Express) => {
router.get("/users/:id",getUseByIdAPI);    
router.get("/users", getAllUseAPI);
router.post("/users", createUserAPI);
router.put("/users/:id", updateUseByIdAPI);
router.delete("/users/:id", deleteUseByIdAPI);

router.get("/account", fetchAccountAPI);
router.post("/login", loginAPI);

router.post("/add-product-to-cart", postAddProductToCartAPI);

app.use("/api", checkValidJWT, router);

}

export default apiRouter;

