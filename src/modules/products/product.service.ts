import ProductModel from './product.model';
import { Product } from './product.interfaces';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

/**
 * Create a product
 * @param {Product} productBody
 * @returns {Promise<Product>}
 */
export const createProduct = async (productBody: Product): Promise<Product> => {
  const product = await ProductModel.create(productBody);
  return product;
};

/**
 * Get product by id
 * @param {string} id
 * @returns {Promise<Product>}
 */
export const getProductById = async (id: string): Promise<Product> => {
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

/**
 * Update product by id
 * @param {string} id
 * @param {Partial<Product>} updateBody
 * @returns {Promise<Product>}
 */
export const updateProductById = async (id: string, updateBody: Partial<Product>): Promise<Product> => {
  const product = await ProductModel.findByIdAndUpdate(id, updateBody, { new: true, runValidators: true });
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

/**
 * Delete product by id
 * @param {string} id
 * @returns {Promise<Product>}
 */
export const deleteProductById = async (id: string): Promise<Product> => {
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};


/**
 * Query products with filters and pagination
 * @param {Object} filter - Mongo filter object
 * @param {Object} options - Query options (e.g., pagination, sorting)
 * @returns {Promise<Array<Product>>}
 */
export const queryProducts = async (filter: any, options: any): Promise<Array<Product>> => {
  const products = await ProductModel.find(filter, null, options);
  return products;
};

/**
 * Get all products
 * @returns {Promise<Array<Product>>}
 */
export const getAllProducts = async (): Promise<Array<Product>> => {
  const products = await ProductModel.find();
  console.log('products', products)
  return products ;
};
