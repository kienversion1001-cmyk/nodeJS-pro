import { prisma } from "config/client";


const getProductWithFiltered = async (page: number, pageSize: number, price: string, 
    factory: string, sort: string, target: string) => {
  const whereConditions: any = {};
  const orderByConditions: any = {};
  if (price) {
    const priceInput= price.split(',');
    const priceConditionsArray= [];
    for (const range of priceInput) {
     if(range==="under-10"){
        priceConditionsArray.push({ price: { lt: 10000000 } });
     }
      if(range==="10-15"){
        priceConditionsArray.push({ price: { gte: 10000000, lte: 15000000 } });
     }
      if(range==="15-20"){
        priceConditionsArray.push({ price: { gte: 15000000, lte: 20000000 } });
     }
      if(range==="over-20"){
        priceConditionsArray.push({ price: { gt: 20000000 } });
     }
    }
    whereConditions.OR = priceConditionsArray;

   
  }
  if (factory) {
    const factoryInputs = factory.split(',');
    whereConditions.factory = {
      in: factoryInputs
    };

    
  }


  if (target) {
    const targetInputs = target.split(',');
    whereConditions.target = {
      in: targetInputs
    };
  }

    if (sort) { 
    if (sort === 'high_price_first') {
      orderByConditions.price = 'desc';
    }
    if (sort === 'low_price_first') {
      orderByConditions.price = 'asc';
    }
  }

 

  const [products, count] = await prisma.$transaction([
    prisma.product.findMany({
    where: whereConditions,
    orderBy: orderByConditions,
    skip: (page - 1) * pageSize,
    take: pageSize
  }),
    prisma.product.count({ where: whereConditions })
  ]);
const totalPages = Math.ceil(count / pageSize);
  return { products, count, totalPages };
};


const productMinPriceFilter = async (minPrice: number) => {
    return await prisma.product.findMany({
        where: {
            price: {
                gte: minPrice
            }
        }
    });
};

const productMaxPriceFilter = async (maxPrice: number) => {
    return await prisma.product.findMany({
        where: {
            price: {
                lte: maxPrice
            }
        }
    });
};

const productFactoryFilter = async (factory: string) => {
    return await prisma.product.findMany({
        where: {
            factory: {
                equals: factory
            }
        }
    });
};

const productFactoryFilters = async (factoryArray: string[]) => {
    return await prisma.product.findMany({
        where: {
            factory: {
                in: factoryArray
            }
        }
    });
};

const productPriceFilters = async (priceRange: { min: number; max: number }) => {
    return await prisma.product.findMany({
        where: {
            price: {
                gte: priceRange.min,
                lte: priceRange.max
            }
        }
    });
};


export { productMinPriceFilter, productMaxPriceFilter, productFactoryFilter, 
    productFactoryFilters, productPriceFilters,getProductWithFiltered };