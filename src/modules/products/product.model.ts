import mongoose from 'mongoose';
import { Product } from './product.interfaces';

const productSchema = new mongoose.Schema<Product>(
  {
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: [String],
      required: true,
    },
    descriptionProduct: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<Product>('Product', productSchema);

export default ProductModel;
