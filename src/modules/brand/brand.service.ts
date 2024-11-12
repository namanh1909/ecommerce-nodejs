import BrandModel from './brand.model';
import { Brand } from './brand.interfaces';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { CommonResponseType } from '../../config/response';
// import multer from 'multer';
import { Request, Response } from 'express';
import config from '../../config/config';
import path from 'path';




/**
 * Create a brand
 * @param {Brand} brandBody
 * @returns {Promise<Brand>}
 */

export const createOrUpdateBrand = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, brandName, description } = req.body;
    const brandImage = req.file ? path.posix.join(req.file.path.replace(/\\/g, '/')) : null;

    let brand;
    if (id) {
      brand = await BrandModel.findByIdAndUpdate(
        id,
        { brandName, brandImage, description },
        { new: true, runValidators: true }
      );
      if (!brand) {
        return res.status(httpStatus.NOT_FOUND).json({
          code: httpStatus.NOT_FOUND,
          data: null,
          message: 'Brand not found',
          success: false,
        });
      }
    } else {
      brand = new BrandModel({
        brandName,
        brandImage,
        description,
      });
      await brand.save();
    }

    const imageUrl = brandImage ? `${req.protocol}://${req.get('host')}/${brandImage}` : null;

    const response = {
      code: id ? httpStatus.OK : httpStatus.CREATED,
      data: { ...brand.toObject(), imageUrl },
      message: id ? 'Brand updated successfully' : 'Brand created successfully',
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
export const updateBrandById = async (id: string, updateBody: Partial<Brand>): Promise<Brand> => {
  const brand = await BrandModel.findByIdAndUpdate(id, updateBody, { new: true, runValidators: true });
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
      brand.brandImage = `${serverDomain}/${brand.brandImage}`;
    }
    return brand;
  });

  return updatedBrands;
};