import { prisma } from 'config/client';
import { ORDER_ITEMS_PER_PAGE } from 'config/constants';


const getOrder = async (page: number) => {

  const PAGE_SIZE = ORDER_ITEMS_PER_PAGE;
  const skip = (page - 1) * PAGE_SIZE;

  return await prisma.order.findMany({
    include:{
        user:true
    },
    skip,
    take: PAGE_SIZE
  });
}
const  countTotalPagesOrder = async () => {
  const totalOrders = await prisma.order.count();
  return Math.ceil(totalOrders / ORDER_ITEMS_PER_PAGE);
}


const getOrderDetail = async (orderId:number) => {
  return await prisma.orderDetail.findMany({
    where:{orderId},
    include:{
        product:true
    }
  });
}




export {getOrder,getOrderDetail,countTotalPagesOrder}