import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as brandService from './brand.service';
import { CommonResponseType } from '../../config/response';

export const createBrand = catchAsync(async (req: Request, res: Response) => {
  try {
    console.log('req.body', req.body);
    const brand = await brandService.createOrUpdateBrand(req.body, res);
    const response: CommonResponseType<typeof brand> = {
      code: httpStatus.CREATED,
      data: brand,
      message: 'Brand created successfully',
      success: true,
    };
    res.status(httpStatus.CREATED).send(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const response: CommonResponseType<null> = {
      code: httpStatus.BAD_REQUEST,
      data: null,
      message: errorMessage,
      success: false,
    };
    res.status(httpStatus.BAD_REQUEST).send(response);
  }
});

export const getBrandById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id === 'string') {
    const brand = await brandService.getBrandById(id);
    const response: CommonResponseType<typeof brand> = {
      code: httpStatus.OK,
      data: brand,
      message: 'Brand retrieved successfully',
      success: true,
    };
    res.send(response);
  } else {
    const response: CommonResponseType<null> = {
      code: httpStatus.BAD_REQUEST,
      data: null,
      message: 'Invalid brand ID',
      success: false,
    };
    res.status(httpStatus.BAD_REQUEST).send(response);
  }
});

export const updateBrandById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id === 'string') {
    const brand = await brandService.updateBrandById(id, req.body);
    const response: CommonResponseType<typeof brand> = {
      code: httpStatus.OK,
      data: brand,
      message: 'Brand updated successfully',
      success: true,
    };
    res.send(response);
  } else {
    const response: CommonResponseType<null> = {
      code: httpStatus.BAD_REQUEST,
      data: null,
      message: 'Invalid brand ID',
      success: false,
    };
    res.status(httpStatus.BAD_REQUEST).send(response);
  }
});

export const deleteBrandById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id === 'string') {
    await brandService.deleteBrandById(id);
    const response: CommonResponseType<null> = {
      code: httpStatus.NO_CONTENT,
      data: null,
      message: 'Brand deleted successfully',
      success: true,
    };
    res.status(httpStatus.NO_CONTENT).send(response);
  } else {
    const response: CommonResponseType<null> = {
      code: httpStatus.BAD_REQUEST,
      data: null,
      message: 'Invalid brand ID',
      success: false,
    };
    res.status(httpStatus.BAD_REQUEST).send(response);
  }
});
export const getAllBrands = catchAsync(async (req: Request, res: Response) => {
  console.log(req)
  const brands = await brandService.getAllBrands();
  const response: CommonResponseType<typeof brands> = {
    code: httpStatus.CREATED,
    data: brands,
    message: 'Brand created successfully',
    success: true,
  };
  res.status(httpStatus.CREATED).send(response);
});

