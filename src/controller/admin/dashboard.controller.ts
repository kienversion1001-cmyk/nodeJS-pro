import e, { Request, Response } from 'express';
import { getAllUsers, getAllRoles, handerCreateUser, deleteUserById, getUserById, 
  handerUpdateUser,countTotalPagesUser } from 'service/user.service';
import { getProductList,countTotalPagesProduct } from 'service/admin/product.service';
import { getOrder, getOrderDetail,countTotalPagesOrder } from 'service/admin/order.service';
import { getDashboardInfo } from 'service/admin/dashboard.service';


const getDashboardPage = async (req: Request, res: Response) => {

  const info = await getDashboardInfo();

  return res.render('admin/dashboard/show.ejs', { info: info });
}


const getAdminUserPage = async (req: Request, res: Response) => {
  const {page} = req.query;

  let currentPage = parseInt(page as string) || 1;
  if (currentPage < 1) currentPage = 1;

  const userList = await getAllUsers(currentPage);
  const totalPage = await countTotalPagesUser();
  return res.render('admin/user/show.ejs', { userList: userList,page:+currentPage,totalPage:+totalPage});
}

const getAdminProductPage = async (req: Request, res: Response) => {
   const {page} = req.query;

  let currentPage = parseInt(page as string) || 1;
  if (currentPage < 1) currentPage = 1;

  const productList = await getProductList(currentPage);
  const totalPage = await countTotalPagesProduct();
  return res.render('admin/product/show.ejs', { productList: productList,page:+currentPage,totalPage:+totalPage});
}

const getAdminOrderPage = async (req: Request, res: Response) => {
 const {page} = req.query;

  let currentPage = parseInt(page as string) || 1;
  if (currentPage < 1) currentPage = 1;

  const orders = await getOrder(currentPage);
  const totalPage = await countTotalPagesOrder();


  return res.render('admin/order/show.ejs', { orders, page: +currentPage,totalPage:+totalPage });
}

const getAdminOrderDetailPage = async (req: Request, res: Response) => {

  const { orderId } = req.params;
  const orderDetails = await getOrderDetail(+orderId);


  return res.render('admin/order/detail.ejs', { orderDetails, orderId });
}

const getAdminDashboardPage = async (req: Request, res: Response) => {

  return res.render('admin/user/show.ejs');
}

const getAdminCreateUserPage = async (req: Request, res: Response) => {
  const roles = await getAllRoles();
  return res.render('admin/user/create', { roles: roles });
}

const postCreateUser = async (req: Request, res: Response) => {
  const { fullname, username, address, phone, role } = req.body;
  const file = req.file;
  const avatar = file ? file.filename : '';
  await handerCreateUser(fullname, username, address, phone, avatar, role);
  //  console.log('>>> check created user: ', a);  
  return res.redirect('/admin/user');
}


const postDeleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  await deleteUserById(userId);
  return res.redirect('/admin/user');
}

const getViewUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const roles = await getAllRoles();
  const user = await getUserById(userId);

  return res.render('admin/user/detail.ejs', { user: user, roles: roles });

}

const postUpdateUser = async (req: Request, res: Response) => {
  const { id, fullname, address, phone, role } = req.body;
  const file = req.file;
  // const avatar = file ? file.filename : '';
  const avatar = file?.filename ?? undefined;
  await handerUpdateUser(id, fullname, address, phone, avatar, role);
  //  console.log('>>> check created user: ', a);  
  return res.redirect('/admin/user');
}

export {
  getDashboardPage, getAdminUserPage, getAdminProductPage, getAdminOrderPage
  , getAdminDashboardPage, getAdminCreateUserPage, postCreateUser, postDeleteUser, getViewUser
  , postUpdateUser, getAdminOrderDetailPage
};
