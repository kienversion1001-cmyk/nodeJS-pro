// Express 本体と Express 型をインポート
import express, { Express } from 'express';
import fileUploadMiddleware from 'middleware/multer';
import passport from "passport";
// コントローラー（画面表示や処理を書く関数）を読み込む
import {
  getHomePage,
  getCreateUserPage,getProductFilteredPage
} from 'controller/client/users.controller';


import { getCartPage, getCheckoutPage, getOrderHistoryPage, getProductDetail, getThanksPage, postAddProductToCart, postDeleteProductInCart, postHandleCartToCheckout, postPlaceOrder ,postAddProductToCartFromDetailPage} from 'controller/client/productController';

import {
  getDashboardPage, getAdminUserPage, getAdminProductPage, getAdminOrderPage
  , getAdminCreateUserPage, postCreateUser, postDeleteUser, getViewUser, postUpdateUser,
  getAdminOrderDetailPage
} from 'controller/admin/dashboard.controller';
import {
  getAdminCreateProductPage, postAdminCreateProductPage, postDeleteProduct
  , getAdminProductDetail, postAdminUpdateProductPage
}
  from 'controller/admin/product.controller';

import { getLoginPage, getRegisterPage, postLogout, postRegister } from 'controller/client/auth.controller'
import { format } from 'path';
import { isAdmin, isLogin } from 'middleware/auth';
import { getSuccessRedirectPage } from 'service/client/auth.service';
// Router オブジェクトを作成（ルートのまとめ役）
const router = express.Router();

/**
 * アプリ全体にルーティングを登録する関数
 * @param app Expressアプリケーション
 */
const webRoute = (app: Express) => {

router.get("/", getHomePage);

  // router.get('/create-user', getCreateUserPage);
router.get ("/products",getProductFilteredPage);
  router.get('/success-redirect', getSuccessRedirectPage);
  router.get('/product/:id', getProductDetail);
  router.get('/cart', getCartPage);
  router.post('/delete-product-in-cart/:id',postDeleteProductInCart);
  router.get('/checkout',getCheckoutPage);
  router.post('/handle-cart-to-checkout',postHandleCartToCheckout)
  router.post('/place-order',postPlaceOrder)
  router.get('/thanks',getThanksPage)
  router.get('/order-history',getOrderHistoryPage)
  router.post('/add-to-cart-from-detail-page/:id',postAddProductToCartFromDetailPage)




  router.get('/login', getLoginPage);
  router.get('/register', getRegisterPage);
  router.post('/register', postRegister);
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/success-redirect',
    failureRedirect: '/login',
    failureMessage: true
  }));

  router.post('/logout', postLogout);

  router.post('/add-product-to-cart/:id', postAddProductToCart)
  // admin

  router.get('/admin', getDashboardPage);


  router.get('/admin/order', getAdminOrderPage);
  router.get('/admin/view-order/:orderId', getAdminOrderDetailPage);


  router.get('/admin/product', getAdminProductPage);
  router.get('/admin/create-product', getAdminCreateProductPage);
  router.post('/admin/create-product', fileUploadMiddleware("image", "images/product"), postAdminCreateProductPage);

  router.post('/admin/delete-product/:id', postDeleteProduct);
  router.get('/admin/view-product/:id', getAdminProductDetail);
  router.post('/admin/update-product', fileUploadMiddleware("image", "images/product"), postAdminUpdateProductPage);





  router.get('/admin/user', getAdminUserPage);
  router.get('/admin/create-user', getAdminCreateUserPage);

  router.post('/admin/hander-create-user', fileUploadMiddleware("avatar"), postCreateUser);

  router.post('/admin/delete-user/:id', postDeleteUser)

  router.get('/admin/view-user/:id', getViewUser);

  router.post('/admin/update-user', fileUploadMiddleware("avatar"), postUpdateUser);

  //router.get('/admin/dashboard', getAdminDashboardPage);

  // 作った router を アプリに登録
  // これで "/" の配下にすべてのルートが有効になる
  app.use('/', isAdmin, router);
};

// 他のファイルで使えるようにエクスポート
export default webRoute;
