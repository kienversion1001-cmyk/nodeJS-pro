import e, { Request, Response } from 'express';
import { productSchema, ProductFormData } from 'validation/product.validation';

import { createProduct, handerDeleteProduct, getProductbyId ,updateProductById} from 'service/admin/product.service';
import { get } from 'http';
const getAdminCreateProductPage = async (req: Request, res: Response) => {
  const errors: string[] = [];
  const oldData = {
    name: '',
    price: '',
    detail_description: '',
    short_description: '',
    quantity: '',
    factory: '',
    target: ''
  };
  return res.render('admin/product/create.ejs', { errors, oldData });
}

const postAdminCreateProductPage = async (req: Request, res: Response) => {
  const {
    name,
    price,
    detail_description,
    short_description,
    quantity,
    factory,
    target
  } = req.body as ProductFormData;

  const validation = productSchema.safeParse(req.body);
  if (!validation.success) {
    const errors = validation.error.errors.map((err) => err.message);
    const oldData = {
      name,
      price,
      detail_description,
      short_description,
      quantity,
      factory,
      target
    };
    return res.render('admin/product/create.ejs', { errors, oldData });


  }
  const imageFile = req?.file?.filename ?? null;

  await createProduct(name,
    +price,
    detail_description,
    short_description,
    +quantity,
    factory,
    target, imageFile);

  return res.redirect('/admin/product');
}

const postDeleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handerDeleteProduct(+id);
  return res.redirect('/admin/product');
}

const getAdminProductDetail = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await getProductbyId(+id);
  const factoryOptions = [
    { name: "Apple (MacBook)", value: "APPLE" },
    { name: "Asus", value: "ASUS" },
    { name: "Lenovo", value: "LENOVO" },
    { name: "Dell", value: "DELL" },
    { name: "LG", value: "LG" },
    { name: "Acer", value: "ACER" },
  ];

  const targetOptions = [
    { name: "Gaming", value: "GAMING" },
    { name: "オフィス", value: "OFFICE" },
    { name: "グラフィックデザイン", value: "GRAPHIC-DESIGN" },
    { name: "薄くて軽い", value: "LIGHTWEIGHT" },
    { name: "ビジネスマン", value: "BUSINESSMAN" },
  ];
return res.render('admin/product/detail.ejs', { product, factoryOptions, targetOptions });

}
const postAdminUpdateProductPage = async (req: Request, res: Response) => {
  const {
    id, name,
    price,
    detail_description, short_description,
    quantity, factory,
    target, image}=req.body as ProductFormData;

  const imageFile = req?.file?.filename ?? null;
  await  updateProductById(+id, name,
    +price,
    detail_description,short_description,
    +quantity,factory,
    target, imageFile);
  return res.redirect('/admin/product');


  }





export {
  getAdminCreateProductPage, postAdminCreateProductPage, postDeleteProduct, getAdminProductDetail
  ,postAdminUpdateProductPage

};