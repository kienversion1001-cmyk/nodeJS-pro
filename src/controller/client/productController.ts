import { Request, Response } from 'express';
import { use } from 'passport';
import { addProductToCart, deleteProductInCart, getProductById, getProductInCart, handlePlaceOrder, updateDetailCartsBeforCheckout,getOrderHistory } from 'service/client/item.service'

const getProductDetail = async (req: Request, res: Response) => {

  const { id } = req.params;
  const product = await getProductById(+id);
  return res.render('client/product/detail.ejs', { product });
}


const postAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;



  if (user) {
    await addProductToCart(1, +id, user)
  } else {
    res.redirect('/login')
  }
  res.redirect('/')
};

const getCartPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect('/login')

  const cartDetails = await getProductInCart(+user.id)

  const totalPrice = cartDetails?.map(item => +item.quantity * +item.price)?.reduce((a,b)=>a+b,0)

  const cartId=cartDetails?.[0]?.cartId??null;

  return res.render('client/product/cart.ejs',{cartDetails,totalPrice,cartId})
}

const postDeleteProductInCart=async(req: Request, res: Response)=>{
  const {id}=req.params;
  const user=req.user;

  if(user){
      await deleteProductInCart(+id,user.sumCart,user.id)
  }else{
    return res.redirect('/login')
  }

  return res.redirect('/cart')

}

const getCheckoutPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect('/login')

  const cartDetails = await getProductInCart(+user.id)

  const totalPrice = cartDetails?.map(item => +item.quantity * +item.price)?.reduce((a,b)=>a+b,0)

  return res.render('client/product/checkout.ejs',{cartDetails,totalPrice})
}

const postHandleCartToCheckout = async (req: Request, res: Response) => {
  const user = req.user;
  const cartId= req.body?.cartId??null;
  if (!user) return res.redirect('/login')

    const currentCarts:{id: string,quantity:string}[]=
    req.body?.cartDetails??[];
    await updateDetailCartsBeforCheckout(currentCarts,+user.id,+cartId);

  return res.redirect('/checkout')
}

const postPlaceOrder = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect('/login')

    const {receiverName,receiverAddress,receiverPhone,totalPrice}=req.body;
    

  const error = await handlePlaceOrder(user.id,receiverName,receiverAddress,receiverPhone,totalPrice)
  console.log("error",error);
  if(error){
    return res.redirect('/checkout')
  }
return res.redirect('/thanks')


  
}

const getThanksPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect('/login')

   
  return res.render('client/product/thanks')
}

const getOrderHistoryPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect('/login')

const order =await getOrderHistory(user.id)
   
  return res.render('client/product/order.history.ejs',{order})
}



const postAddProductToCartFromDetailPage=async(req: Request, res: Response)=>{
  const { id } = req.params;
  const {quantity}=req.body;
  const user = req.user;
  
  if (!user) {
    return res.redirect('/login')
  }
  await addProductToCart(+quantity, +id, user)
  return res.redirect('/product/'+id)
}


export { getProductDetail, postAddProductToCart, getCartPage ,postDeleteProductInCart,getCheckoutPage,
  postHandleCartToCheckout,postPlaceOrder,getThanksPage,getOrderHistoryPage,postAddProductToCartFromDetailPage
};