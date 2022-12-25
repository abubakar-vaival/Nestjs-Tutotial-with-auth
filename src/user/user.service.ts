import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './userschema';
import { UserDetails } from './user-details.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async signUp(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    return await newUser.save();
  }

  async findbyEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email: email }).exec();
  }
  async findbyId(Id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(Id).exec();
    if (!user) {
      throw new NotFoundException('User Not Found');
    } else if (user) {
      return this._getUserDetails(user);
    }
  }
}
