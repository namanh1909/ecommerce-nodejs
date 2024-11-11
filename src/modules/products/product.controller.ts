import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import * as productService from './product.service';
import { CommonResponseType } from '../../config/response';

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  const response: CommonResponseType<typeof product> = {
    code: httpStatus.CREATED,
    data: product,
    message: 'Product created successfully',
    success: true,
  };
  res.status(httpStatus.CREATED).send(response);
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['productName', 'brandId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  const response: CommonResponseType<typeof result> = {
    code: httpStatus.OK,
    data: result,
    message: 'Products retrieved successfully',
    success: true,
  };
  res.send(response);
});

export const getAllProduct = catchAsync(async (_req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  const response: CommonResponseType<typeof products> = {
    code: httpStatus.OK,
    data: products,
    message: 'All products retrieved successfully',
    success: true,
  };
  res.send(response);
});

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.getProductById(req.params['productId']);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    const response: CommonResponseType<typeof product> = {
      code: httpStatus.OK,
      data: product,
      message: 'Product retrieved successfully',
      success: true,
    };
    res.send(response);
  }
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.updateProductById(req.params['productId'], req.body);
    const response: CommonResponseType<typeof product> = {
      code: httpStatus.OK,
      data: product,
      message: 'Product updated successfully',
      success: true,
    };
    res.send(response);
  }
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    await productService.deleteProductById(req.params['productId']);
    const response: CommonResponseType<null> = {
      code: httpStatus.NO_CONTENT,
      data: null,
      message: 'Product deleted successfully',
      success: true,
    };
    res.status(httpStatus.NO_CONTENT).send(response);
  }
});
