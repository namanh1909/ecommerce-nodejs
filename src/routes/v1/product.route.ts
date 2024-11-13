import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { productController, productValidation } from '../../modules/products';
import { upload } from '../../modules/multer';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageProducts'), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'productImageDetail', maxCount: 5 }]), validate(productValidation.createProduct), productController.createProduct)
  .get(validate(productValidation.getProducts), productController.getProducts);

router
  .route('/all')
  .get(productController.getAllProduct);

router
  .route('/:productId')
  .get(validate(productValidation.getProduct), productController.getProduct)
  .patch(auth('manageProducts'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth('manageProducts'), validate(productValidation.deleteProduct), productController.deleteProduct);

export default router;

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and retrieval
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a product
 *     description: Only admins can create products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - price
 *               - descriptionProduct
 *               - brandId
 *               - thumbnail
 *             properties:
 *               productName:
 *                 type: string
 *               price:
 *                 type: string
 *               descriptionProduct:
 *                 type: string
 *               brandId:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               productImageDetail:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             example:
 *               productName: Sample Product
 *               price: "19.99"
 *               descriptionProduct: This is a sample product
 *               brandId: 12345
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: Get all products without filters
 *     tags: [Products]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   patch:
 *     summary: Update a product
 *     description: Only admins can update products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               price:
 *                 type: string
 *               descriptionProduct:
 *                 type: string
 *             example:
 *               productName: Updated Product
 *               price: "29.99"
 *               descriptionProduct: This is an updated product
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   delete:
 *     summary: Delete a product
 *     description: Only admins can delete products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *  */
