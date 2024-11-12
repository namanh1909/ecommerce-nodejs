import BrandModel from './brand.model';
import { Brand } from './brand.interfaces';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { CommonResponseType } from '../../config/response';
// import multer from 'multer';
import { Request, Response } from 'express';
import config from '../../config/config';
import path from 'path';
import fs from 'fs'

/**
 * Create a brand
 * @param {Brand} brandBody
 * @returns {Promise<Brand>}
 */

export const createBrand = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { brandName, description } = req.body;
    const brandImage = req.file ? path.posix.join(req.file.path.replace(/\\/g, '/')) : null;

    const newBrand = new BrandModel({
      brandName,
      brandImage,
      description,
    });

    await newBrand.save();

    const imageUrl = brandImage ? `${req.protocol}://${req.get('host')}/${brandImage}` : null;

    const response = {
      code: httpStatus.CREATED,
      data: { ...newBrand.toObject(), imageUrl },
      message: 'Brand created successfully',
      success: true,
    };
    return res.status(response.code).json(response);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      message: (error as Error).message,
      success: false,
    });
  }
};
/**
 * Get brand by id
 * @param {string} id
 * @returns {Promise<Brand>}
 */
export const getBrandById = async (id: string): Promise<Brand> => {
  const brand = await BrandModel.findById(id);
  if (!brand) {
    const errorResponse: CommonResponseType<null> = {
      code: httpStatus.NOT_FOUND,
      data: null,
      message: 'Brand not found',
      success: false,
    };
    throw new ApiError(errorResponse.code, errorResponse.message);
  }
  return brand;
};

/**
 * Update brand by id
 * @param {string} id
 * @param {Partial<Brand>} updateBody
 * @returns {Promise<Brand>}
 */

export const updateBrandById = async (id: string, req: Request, res: Response) => {
  try {
    const brand = await BrandModel.findById(id);

    if (!brand) {
      const errorResponse: CommonResponseType<null> = {
        code: httpStatus.NOT_FOUND,
        data: null,
        message: 'Brand not found',
        success: false,
      };
      return res.status(errorResponse.code).json(errorResponse);
    }

    if (req.file) {
      // If a new image is uploaded, delete the old image if it exists
      if (brand.brandImage) {
        const oldImagePath = path.resolve(brand.brandImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Failed to delete old image:', err);
          } else {
            console.log('Old image deleted successfully');
          }
        });
      }

      // Update brandImage with the new image path
      brand.brandImage = path.posix.join(req.file.path.replace(/\\/g, '/'));
    }

    // Apply updates to the brand object
    Object.assign(brand, { ...req.body, brandImage: brand.brandImage});

    // Save updated brand
    await brand.save();

    const response = {
      code: httpStatus.OK,
      data: brand.toObject(),  // Ensure data is serializable
      message: 'Brand updated successfully',
      success: true,
    };
    return res.status(response.code).json(response);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      message: (error as Error).message,
      success: false,
    });
  }
};
/**
 * Delete brand by id
 * @param {string} id
 * @returns {Promise<Brand>}
 */
export const deleteBrandById = async (id: string): Promise<Brand> => {
  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    const errorResponse: CommonResponseType<null> = {
      code: httpStatus.NOT_FOUND,
      data: null,
      message: 'Brand not found',
      success: false,
    };
    throw new ApiError(errorResponse.code, errorResponse.message);
  }
  return brand;
};

/**
 * Get all brands
 * @returns {Promise<Array<Brand>>}
 */
export const getAllBrands = async (): Promise<Array<Brand>> => {
  const brands = await BrandModel.find();

  // Tạo URL gốc từ domain và port
  const serverDomain = `http://localhost:${config.port}`;

  const updatedBrands = brands.map(brand => {
    if (brand.brandImage) {
      // Đảm bảo đường dẫn ảnh đầy đủ
      brand.imageURL = `${serverDomain}/${brand.brandImage}`;
      brand.brandImage = brand.brandImage
    }
    return brand;
  });

  return updatedBrands;
};