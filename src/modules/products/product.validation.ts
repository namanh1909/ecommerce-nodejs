import Joi from 'joi';
export const createProduct = {
  body: Joi.object({
    productName: Joi.string().required(),
    descriptionProduct: Joi.string().required(),
    brandId: Joi.string().required(),
    price: Joi.string().required(),
    thumbnail: Joi.string().uri().required(),
    // productImageDetail: Joi.array().items(Joi.string().uri()),
    size: Joi.string().required(),
    type: Joi.string().required(),
    quantity: Joi.string().required(),
    status: Joi.string().required(),
  }),
};

export const getProduct = {
  params: Joi.object({
    productId: Joi.string().required(),
  }),
};

export const updateProduct = {
  params: Joi.object({
    productId: Joi.string().required(),
  }),
  body: Joi.object({
    productName: Joi.string(),
    productImageDetail: Joi.array().items(Joi.string().uri()),
    descriptionProduct: Joi.string(),
    brandId: Joi.string(),
    price: Joi.number(),
    productImage: Joi.string().uri(),
  }).min(1),
};

export const deleteProduct = {
  params: Joi.object({
    productId: Joi.string().required(),
  }),
};

export const getProducts = {
  query: Joi.object({
    productName: Joi.string(),
    brandId: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
