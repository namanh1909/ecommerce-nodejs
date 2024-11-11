import BrandModel from './brand.model';
import { Brand } from './brand.interfaces';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { CommonResponseType } from '../../config/response';

/**
 * Create a brand
 * @param {Brand} brandBody
 * @returns {Promise<Brand>}
 */
export const createBrand = async (brandBody: Brand): Promise<Brand> => {
  const brand = await BrandModel.create(brandBody);
  return brand;
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
  return brands;
};
