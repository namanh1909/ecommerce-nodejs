import Joi from 'joi';
import { Brand } from './brand.interfaces';

const brandSchema: Record<keyof Brand, any> = {
    brandName: Joi.string().required(),
    brandImage: Joi.string().required(),
    description: Joi.string().required(),
    Id: Joi.string()
};

export const createBrand = {
    body: Joi.object().keys(brandSchema),
};

export const getBrandById = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
};

export const updateBrandById = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        brandName: Joi.string(),
        brandImage: Joi.string(),
        description: Joi.string(),
    }).min(1),
};

export const deleteBrandById = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
};
