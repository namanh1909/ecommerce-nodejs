import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { brandController } from '../../modules/brand';
import { auth } from '../../modules/auth';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(brandController.createBrand), brandController.createBrand);

router
  .route('/:id')
  .get(auth(), validate(brandController.getBrandById), brandController.getBrandById)
  .post(auth(), validate(brandController.updateBrandById), brandController.updateBrandById)
  .delete(auth(), validate(brandController.deleteBrandById), brandController.deleteBrandById);

export default router;

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management and retrieval
 */

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Create a brand
 *     description: Create a new brand.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brandName
 *               - brandImage
 *               - description
 *             properties:
 *               brandName:
 *                 type: string
 *               brandImage:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               brandName: Example Brand
 *               brandImage: http://example.com/image.png
 *               description: This is an example brand.
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Brand'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 * /brands/{id}:
 *   get:
 *     summary: Get a brand
 *     description: Fetch a brand by its ID.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Brand'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a brand
 *     description: Update an existing brand.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandName:
 *                 type: string
 *               brandImage:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               brandName: Updated Brand
 *               brandImage: http://example.com/updated_image.png
 *               description: This is an updated brand description.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Brand'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a brand
 *     description: Delete a brand by its ID.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand id
 *     responses:
 *       "204":
 *         description: No Content
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
