
import { getAllUseAPI, getUseByIdAPI, createUserAPI,updateUseByIdAPI,deleteUseByIdAPI,postAddProductToCartAPI } from "controller/client/api.controller";
import express,{Express} from "express";

const router = express.Router();

const apiRouter = (app:Express) => {
router.get("/users/:id", getUseByIdAPI);    
router.get("/users", getAllUseAPI);
router.post("/users", createUserAPI);
router.put("/users/:id", updateUseByIdAPI);
router.delete("/users/:id", deleteUseByIdAPI);

router.post("/add-product-to-cart", postAddProductToCartAPI);
app.use("/api", router);

}

export default apiRouter;

