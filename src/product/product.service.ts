import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from './productschema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createproduct(
    name: string,
    price: number,
    description?: string,
  ): Promise<ProductDocument> {
    const Product = new this.productModel({
      name: name,
      price: price,
      description: description,
    });

    await Product.save();
    return Product;
  }

  async getAllproducts(): Promise<ProductDocument[]> {
    const products = await this.productModel.find({});
    return products;
  }

  async getSingleproduct(prodId: string): Promise<ProductDocument> {
    const singleproduct = await this.findProduct(prodId);
    return singleproduct;
  }

  async updateProduct(
    prodId: string,
    name: string,
    price: number,
    description?: string,
  ): Promise<ProductDocument> {
    const updatedProduct = await this.findProduct(prodId);
    if (name) {
      updatedProduct.name = name;
    }
    if (price) {
      updatedProduct.price = price;
    }
    if (description) {
      updatedProduct.description = description;
    }
    return await updatedProduct.save();
  }

  async deleteProduct(prodId: string) {
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();
    console.log(result);
  }

  async findProduct(prodId: string): Promise<ProductDocument> {
    let product;
    try {
      product = await this.productModel.findById(prodId).exec();
    } catch (error) {
      throw new NotFoundException(error);
    }
    if (!product) {
      throw new NotFoundException('Product not Found');
    }

    return product;
  }
}
