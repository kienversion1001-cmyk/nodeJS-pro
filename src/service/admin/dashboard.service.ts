import { prisma } from "config/client";


const getDashboardInfo = async () => {
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();  

  return {
    userCount,
    productCount,
    orderCount
  };
}

export { getDashboardInfo };