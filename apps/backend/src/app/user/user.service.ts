import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(userDto: any): Promise<{ message: string }> {
    const { email, password, firstName, lastName } = userDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({ ...userDto, password: hashedPassword });
    const savedUser = await createdUser.save();

    return { message: 'User successfully registered' };
  }

  async isEmailDuplicate(email: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    return !!user;
  }
}
