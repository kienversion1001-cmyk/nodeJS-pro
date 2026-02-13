import { prisma } from 'config/client';
import { PRODUCT_ITEMS_PER_PAGE } from 'config/constants';

const createProduct = async (
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  image: string
) => {
  return await prisma.product.create({
    data: {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
      ...(image && { image: image } ),
    },
  });
};


const getProductList = async (page: number) => {
  const pageSize = PRODUCT_ITEMS_PER_PAGE;
  const skip = (page - 1) * pageSize;
  return await prisma.product.findMany({
    skip: skip,
    take: pageSize,
  });
  
}

const countTotalPagesProduct = async () => {
  const totalItems = await prisma.product.count();
  const pageSize = PRODUCT_ITEMS_PER_PAGE;
  return Math.ceil(totalItems / pageSize);
}

const handerDeleteProduct = async (id: number) => {
   await prisma.product.delete({
    where: {  id: id },
  });
}

const getProductbyId = async (id: number) => {
  return await prisma.product.findUnique({
    where: { id: id },
  });
}


const updateProductById = async (
  id: number,
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  image: string
) => {
  return await prisma.product.update({
    where: { id: id },
    data: {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
      ...(image && { image: image } ),
    },
  });
};

  export {
  createProduct, getProductList,handerDeleteProduct,getProductbyId,updateProductById,countTotalPagesProduct };