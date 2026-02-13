import { prisma } from 'config/client';


const getProducts = async (page: number, pageSize: number) => {
  
  const skip = (page - 1) * pageSize;

  const products = await prisma.product.findMany({
    skip: skip,
    take: pageSize
  });
  return products;
}

const countTotalClientPagesProduct = async (pageSize: number) => {
    const totalItems = await prisma.product.count();
    return Math.ceil(totalItems / pageSize);
}


const getProductById = async (id: number) => {

    return await prisma.product.findUnique({ where: { id: id } })
};

const addProductToCart = async (quantity: number, productId: number, user: Express.User) => {

    const cart = await prisma.cart.findUnique({
        where: {
            userId: user.id
        }
    })

    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })

    if (cart) {
        await prisma.cart.update({
            where: {
                id: cart.id
            },
            data: {
                sum: {
                    increment: quantity,
                },
            }
        })

        const currentCartDetail = await prisma.cartDetail.findFirst({
            where: {
                productId: productId,
                cartId: cart.id
            }
        })


        await prisma.cartDetail.upsert({
            where: {
                id: currentCartDetail?.id ?? 0
            },
            update: {
                quantity: {
                    increment: quantity,
                },
            },
            create: {
                price: product.price,
                quantity: quantity,
                productId: productId,
                cartId: cart.id
            },
        })



    } else {

        await prisma.cart.create({
            data: {
                sum: quantity,
                userId: user.id,
                details: {
                    create: [
                        {
                            productId: product.id,
                            price: product.price,
                            quantity: quantity
                        }
                    ],
                }
            }

        })
    }



};

const getProductInCart = async (userId: number) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId: userId
        }
    })
    if (cart) {
        const currentCartDetails = await prisma.cartDetail.findMany({
            where: {
                cartId: cart.id
            },
            include: {
                product: true
            }
        })
        return currentCartDetails;
    }
    return []
}

const deleteProductInCart = async (cartDetailId: number, sumCart: number, userId: number) => {
    const currentCartDetail = await prisma.cartDetail.findUnique({
        where: {
            id: cartDetailId
        }
    });

    const productQuantity = currentCartDetail?.quantity ?? 1;

    await prisma.cartDetail.delete({
        where: {
            id: cartDetailId
        }
    })

    if (sumCart === 1) {
        await prisma.cart.delete({
            where: {
                userId: userId
            }
        })
    } else {
        await prisma.cart.update({
            where: {
                userId
            },
            data: {
                sum: {
                    decrement: productQuantity,
                }
            }
        })
    }



}

const updateDetailCartsBeforCheckout = async (data: { id: string, quantity: string }[], userId: number,cartId:number) => {
    let totalSum = 0;
    let quantitySum=0;
    for (let i = 0; i < data.length; i++) {
        await prisma.cartDetail.update({
            where: { id: +data[i].id },
            data: {
                quantity: +data[i].quantity
            }

        })
        quantitySum += +data[i].quantity;
        totalSum += +data[i].quantity;

    }


    await prisma.cart.update({
        where: { userId: userId },
        data: {
            sum: totalSum
        }
    })
    //  await prisma.cart.update({
    //     where: { id: cartId },
    //     data: {
    //         sum: quantitySum
    //     }
    // })




}

const handlePlaceOrder = async (userId: number
    , receiverName: string
    , receiverAddress: string
    , receiverPhone: string
    , totalPrice: string
) => {
try {
    
   await prisma.$transaction(async (tx) => {

    const cart = await tx.cart.findUnique({
        where: { userId },
        include: { details: true }
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const dataOrderDetail = cart.details.map(item => ({
        price: item.price,
        quantity: item.quantity,
        productId: item.productId,
    }));

    // ① Order作成
    await tx.order.create({
        data: {
            receiverName,
            receiverAddress,
            receiverPhone,
            paymentMethod: "COD",
            paymentStatus: "PAYMENT_UNPAID",
            status: "PENDING",
            totalPrice: +totalPrice,
            userId: userId,
            orderDetails: {
                create: dataOrderDetail
            }
        }
    });

    // ② CartDetail削除
    await tx.cartDetail.deleteMany({
        where: { cartId: cart.id }
    });

    // ③ Cart削除
    await tx.cart.delete({
        where: { id: cart.id }
    });

        for (let i=0;i<cart.details.length;i++){
            const product = await tx.product.findUnique({
                where:{id:cart.details[i].productId}
            });
            if (!product || product.quantity < cart.details[i].quantity){
                throw new Error(`product ${product?.name } insufficient stock or not found`);

            }
            
            await tx.product.update({
                where:{id:cart.details[i].productId},
                data:{quantity: {
                    decrement: cart.details[i].quantity
                },
            sold:{increment: cart.details[i].quantity}
            }
            })



        }


});
return ""
} catch (error) {
    return error.message;
}

}

const getOrderHistory = async (userId: number) => {

    const orders = await prisma.order.findMany({
        where: {
            userId: userId
        },
        include: {
            orderDetails: {
                include: {
                    product: true
                }
            }

        }
    })
    return orders;
}

export {
    getProducts, getProductById, addProductToCart, getProductInCart, deleteProductInCart
    , updateDetailCartsBeforCheckout, handlePlaceOrder, getOrderHistory,countTotalClientPagesProduct
};