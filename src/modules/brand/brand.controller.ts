import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as brandService from './brand.service';

export const createBrand = catchAsync(async (req: Request, res: Response) => {
  try {
    const brand = await brandService.createBrand(req.body);
    res.status(httpStatus.CREATED).send(brand);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(httpStatus.BAD_REQUEST).send({ message: 'Failed to create brand', error: errorMessage });
  }
});

export const getBrandById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id === 'string') {
    const brand = await brandService.getBrandById(id);
    res.send(brand);
  } else {
    res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid brand ID' });
  }
});

export const updateBrandById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id === 'string') {
        const brand = await brandService.updateBrandById(id, req.body);
        res.send(brand);
    }
    else {
        res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid brand ID' });
    }
});

export const deleteBrandById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id === 'string') {
        await brandService.deleteBrandById(id);
        res.status(httpStatus.NO_CONTENT).send();
    }
    else {
        res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid brand ID' });
    }
});
