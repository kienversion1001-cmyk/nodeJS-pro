import { Request, Response } from 'express';
import {  getAllUsers ,deleteUserById,getUserById} from 'service/user.service';
import { getProducts,countTotalClientPagesProduct } from 'service/client/item.service';
import { countTotalPagesProduct } from 'service/admin/product.service';
import { getProductWithFiltered, productFactoryFilter, productFactoryFilters, productMaxPriceFilter, productMinPriceFilter } from 'service/client/product.filter';

const getHomePage = async (req: Request, res: Response) => {


   const {page} = req.query;

  let currentPage = parseInt(page as string) || 1;
  if (currentPage < 1) currentPage = 1;

  const products = await getProducts(currentPage,8);
    const totalPages = await countTotalClientPagesProduct(8);
  // const user=req.user;
  // // console.log(user);
  return res.render('client/home/show.ejs', { products,page:+currentPage,totalPages:+totalPages });
}

const getCreateUserPage = (req: Request, res: Response) => {
  return res.render('createUser');
}


const getProductFilteredPage = async (req: Request, res: Response) => {
 const {page,price="",factory="",sort="",target=""} = req.query as
  {page?: string, price?: string, factory?: string, sort?: string, target?: string};

  let currentPage = parseInt(page as string) || 1;
  if (currentPage < 1) currentPage = 1;
  // const products = await getProducts(currentPage,6);
  //   const totalPages = await countTotalClientPagesProduct(6);

    const { products, count, totalPages } = await getProductWithFiltered(currentPage,6, price, factory, sort, target);
  return res.render('client/product/filter.ejs', { products ,page:+currentPage,totalPages:+totalPages});


// const {minPrice,maxPrice,price,factory,sort} = req.query;

//   let minPriceNumber = parseFloat(minPrice as string) || 0;
//   const allProducts = await productMinPriceFilter(minPriceNumber); // すべての商品を取得（必要に応じて調整）




//   let maxPriceNumber = parseFloat(maxPrice as string) || 0;
//   const allProducts = await productMaxPriceFilter(maxPriceNumber);


// const allProducts = await productFactoryFilter(factory as string); // すべての商品を取得（必要に応じて調整）

// const allProducts = await productFactoryFilters((factory as string).split(',')); // すべての商品を取得（必要に応じて調整）


  //  res.status(200).json({data: allProducts});// フィルタリングされた商品を返す 

}


  // ここで productId を使ってデータベースから商品情報を取得する処理を追加できます  






export { getHomePage, getCreateUserPage, getProductFilteredPage };