import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../app';
import setupTestDB from '../jest/setupTestDB';
import Brand from './brand.model';
import { Brand as BrandInterface } from './brand.interfaces';

setupTestDB();

const brandOne = {
  _id: new mongoose.Types.ObjectId(),
  brandName: faker.company.companyName(),
  brandImage: faker.image.imageUrl(),
  description: faker.lorem.sentence(),
};

const insertBrands = async (brands: Record<string, any>[]) => {
  await Brand.insertMany(brands);
};

describe('Brand routes', () => {
  describe('POST /v1/brands', () => {
    let newBrand: BrandInterface;
    beforeEach(() => {
      newBrand = {
        brandName: faker.company.companyName(),
        brandImage: faker.image.imageUrl(),
        description: faker.lorem.sentence(),
      };
    });

    test('should return 201 and successfully create new brand if request data is valid', async () => {
      const res = await request(app).post('/v1/brands').send(newBrand).expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        brandName: newBrand.brandName,
        brandImage: newBrand.brandImage,
        description: newBrand.description,
      });

      const dbBrand = await Brand.findById(res.body.id);
      expect(dbBrand).toBeDefined();
      expect(dbBrand).toMatchObject(newBrand);
    });

    test('should return 400 error if brandName is missing', async () => {
   
      await request(app).post('/v1/brands').send(newBrand).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if brandImage is missing', async () => {

      await request(app).post('/v1/brands').send(newBrand).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if description is missing', async () => {

      await request(app).post('/v1/brands').send(newBrand).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/brands', () => {
    test('should return 200 and all brands', async () => {
      await insertBrands([brandOne]);

      const res = await request(app).get('/v1/brands').send().expect(httpStatus.OK);

      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject(brandOne);
    });
  });

  describe('GET /v1/brands/:brandId', () => {
    test('should return 200 and the brand object if data is valid', async () => {
      await insertBrands([brandOne]);

      const res = await request(app).get(`/v1/brands/${brandOne._id}`).send().expect(httpStatus.OK);

      expect(res.body).toMatchObject(brandOne);
    });

    test('should return 404 error if brand is not found', async () => {
      const brandId = new mongoose.Types.ObjectId();

      await request(app).get(`/v1/brands/${brandId}`).send().expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/brands/:brandId', () => {
    test('should return 204 if brand is deleted', async () => {
      await insertBrands([brandOne]);

      await request(app).delete(`/v1/brands/${brandOne._id}`).send().expect(httpStatus.NO_CONTENT);

      const dbBrand = await Brand.findById(brandOne._id);
      expect(dbBrand).toBeNull();
    });

    test('should return 404 error if brand is not found', async () => {
      const brandId = new mongoose.Types.ObjectId();

      await request(app).delete(`/v1/brands/${brandId}`).send().expect(httpStatus.NOT_FOUND);
    });
  });
});
