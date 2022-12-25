import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtGaurd } from 'src/auth/gaurds/jwt.gaurd';
import { ProductModule } from './product.module';
import { ProductService } from './product.service';
import { ProductDocument } from './productschema';

//('https://documenter.getpostman.com/view/20116498/2s8Z6vZZfm');
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('createproduct')
  async createProduct(
    @Body() completebody: { name: string; price: number; description?: string },
  ): Promise<ProductDocument> {
    const product = this.productService.createproduct(
      completebody.name,
      completebody.price,
      completebody.description,
    );
    return product;
  }

  @UseGuards(JwtGaurd)
  @Get('getallproducts')
  async getAllproducts(): Promise<ProductDocument[]> {
    const products = await this.productService.getAllproducts();
    return products;
  }

  @UseGuards(JwtGaurd)
  @Get('getsingleproduct/:id')
  async getSingleproduct(
    @Param('id') prodId: string,
  ): Promise<ProductDocument> {
    const singleproduct = await this.productService.getSingleproduct(prodId);
    return singleproduct;
  }

  @Patch('updateproduct/:id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body()
    completeBody: {
      name: string;
      price: number;
      description?: string;
    },
  ): Promise<ProductDocument> {
    const updatedproduct = await this.productService.updateProduct(
      prodId,
      completeBody.name,
      completeBody.price,
      completeBody.description,
    );
    return updatedproduct;
  }

  @Delete('deleteproduct/:id')
  async deleteProduct(@Param('id') prodid: string) {
    return await this.productService.deleteProduct(prodid);
  }
}
