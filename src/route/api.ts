
import { getAllUseAPI, getUseByIdAPI, postAddProductToCartAPI } from "controller/client/api.controller";
import express,{Express} from "express";

const router = express.Router();

const apiRouter = (app:Express) => {
router.get("/users/:id", getUseByIdAPI);    
router.get("/users", getAllUseAPI);

router.post("/add-product-to-cart", postAddProductToCartAPI);
app.use("/api", router);

}

export default apiRouter;

