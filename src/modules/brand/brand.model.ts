import mongoose from 'mongoose';
import { Brand } from './brand.interfaces';

const brandSchema = new mongoose.Schema<Brand>(
  {
    brandName: {
      type: String,
      required: true,
      unique: true, // Thêm thuộc tính unique
    },
    brandImage: {
      type: String, // Changed from Buffer to String to handle base64
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const BrandModel = mongoose.model<Brand>('Brand', brandSchema);

export default BrandModel;
