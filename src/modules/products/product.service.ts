import ProductModel from './product.model';
import { Product } from './product.interfaces';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import fs from 'fs';
/**
 * Create a product
 * @param {Product} productBody
 * @returns {Promise<Product>}
 */
import { Response } from 'express';
import path from 'path';

export const createProduct = async (req: any, res: Response): Promise<Response> => {
  try {
    const { productName, descriptionProduct, price, brandId, size, type, quantity, status } = req.body as {
      productName: string;
      descriptionProduct: string;
      price: string;
      brandId: string;
      size: string;
      type: string;
      quantity: string;
      status: string;
    };

    // Handle multiple images for productImageDetail
    const productImageDetail = req?.files?.productImageDetail
      ? (req?.files?.productImageDetail as Express.Multer.File[])?.map((file) =>
          path.posix.join(file?.path?.replace(/\\/g, '/'))
        )
      : [];

    // Handle single image for thumbnail
    const thumbnail = req.files.thumbnail
      ? (req?.files?.thumbnail as Express.Multer.File[])?.map((file) => path.posix.join(file?.path?.replace(/\\/g, '/')))[0]
      : [];

    const newProduct = new ProductModel({
      productName,
      productImageDetail,
      descriptionProduct,
      price,
      brandId,
      thumbnail,
      size,
      type,
      quantity,
      status,
    });

    await newProduct.save();

    // Generate URLs for images
    const productImageUrls = productImageDetail?.map((image) => `${req.protocol}://${req.get('host')}/${image}`);
    const thumbnailUrl = thumbnail ? `${req.protocol}://${req.get('host')}/${thumbnail}` : null;

    const response = {
      code: httpStatus.CREATED,
      data: { ...newProduct.toObject(), productImageUrls, thumbnailUrl },
      message: 'Product created successfully',
      success: true,
    };
    return res.status(response.code).json(response);
  } catch (error) {
    // Delete uploaded files if an error occurs
    if (req?.files?.productImageDetail) {
      (req.files.productImageDetail as Express.Multer.File[]).forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error(`Failed to delete file: ${file.path}`, err);
        });
      });
    }
    if (req?.files?.thumbnail) {
      (req.files.thumbnail as Express.Multer.File[]).forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error(`Failed to delete file: ${file.path}`, err);
        });
      });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      message: (error as Error).message,
      success: false,
    });
  }
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
  console.log('products', products);
  return products;
};
