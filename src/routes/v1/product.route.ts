import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { productController, productValidation } from '../../modules/products';
import { upload } from '../../modules/multer';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'productImageDetail', maxCount: 5 }]), validate(productValidation.createProduct), productController.createProduct)
  .get(validate(productValidation.getProducts), productController.getProducts);

router
  .route('/all')
  .get(productController.getAllProduct);

router
  .route('/:productId')
  .get(validate(productValidation.getProduct), productController.getProduct)
  .patch(auth('manageProducts'), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'productImageDetail', maxCount: 5 }]), validate(productValidation.updateProduct), productController.updateProduct)
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
 *     summary: Create a new product
 *     description: Allows admins to create a new product with details including images.
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
 *               - descriptionProduct
 *               - brandId
 *               - price
 *               - thumbnail
 *               - size
 *               - type
 *               - quantity
 *               - status
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Name of the product
 *               descriptionProduct:
 *                 type: string
 *                 description: Detailed description of the product
 *               brandId:
 *                 type: string
 *                 description: Identifier for the brand
 *               price:
 *                 type: string
 *                 description: Price of the product
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 description: URI of the thumbnail image of the product
 *               size:
 *                 type: string
 *                 description: Size of the product
 *               type:
 *                 type: string
 *                 description: Type of the product
 *               quantity:
 *                 type: string
 *                 description: Quantity of the product
 *               status:
 *                 type: string
 *                 description: Status of the product
 *             example:
 *               productName: Sample Product
 *               descriptionProduct: This is a sample product
 *               brandId: 12345
 *               price: "19.99"
 *               thumbnail: http://example.com/sample-thumbnail.jpg
 *               size: Medium
 *               type: Clothing
 *               quantity: "100"
 *               status: Available
 *     responses:
 *       "201":
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *   get:
 *     summary: Retrieve all products
 *     description: Fetch a list of all products with optional filters.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: productName
 *         schema:
 *           type: string
 *         description: Filter by product name
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: string
 *         description: Filter by brand ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Maximum number of products to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Page number
 *     responses:
 *       "200":
 *         description: List of products retrieved successfully
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
 *     summary: Retrieve all products without filters
 *     description: Fetch all products without applying any filters.
 *     tags: [Products]
 *     responses:
 *       "200":
 *         description: All products retrieved successfully
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
 *     summary: Retrieve a specific product
 *     description: Fetch details of a product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the product
 *     responses:
 *       "200":
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   patch:
 *     summary: Update a specific product
 *     description: Allows admins to update product details.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the product
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Updated name of the product
 *               price:
 *                 type: string
 *                 description: Updated price of the product
 *               descriptionProduct:
 *                 type: string
 *                 description: Updated description of the product
 *               brandId:
 *                 type: string
 *                 description: Updated brand ID of the product
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Updated thumbnail image of the product
 *               productImageDetail:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Updated detailed images of the product
 *             example:
 *               productName: Updated Product
 *               price: "29.99"
 *               descriptionProduct: This is an updated product
 *               brandId: 12345
 *               thumbnail: updated-thumbnail.jpg
 *               productImageDetail: [updated-image1.jpg, updated-image2.jpg]
 *     responses:
 *       "200":
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   delete:
 *     summary: Delete a specific product
 *     description: Allows admins to delete a product by its ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the product
 *     responses:
 *       "200":
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
