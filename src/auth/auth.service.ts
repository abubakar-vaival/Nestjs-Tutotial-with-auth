import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { NewUserDTO } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { ExistingUserDTO } from 'src/user/dtos/existing-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async hashPassword(password: string): Promise<string> {
    let salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async Register(user: Readonly<NewUserDTO>): Promise<UserDetails | null> {
    const { name, email, password } = user;
    const existingUser = await this.userService.findbyEmail(email);
    if (existingUser) {
      return null;
    }
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.signUp(name, email, hashedPassword);
    return this.userService._getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedpassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedpassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | any> {
    const user = await this.userService.findbyEmail(email);
    const doesUserExist = !!user;
    if (!doesUserExist) {
      return null;
    }
    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (doesPasswordMatch === false) {
      return null;
    }

    return this.userService._getUserDetails(user);
  }

  async login(
    existingUser: Readonly<ExistingUserDTO>,
  ): Promise<{ token: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);
    if (!user) {
      return null;
    }
    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }
}
