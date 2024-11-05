import mongoose from 'mongoose';
import { Brand } from './brand.interfaces';

const brandSchema = new mongoose.Schema<Brand>(
  {
    brandName: {
      type: String,
      required: true,
    },
    brandImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BrandModel = mongoose.model<Brand>('Brand', brandSchema);

export default BrandModel;
