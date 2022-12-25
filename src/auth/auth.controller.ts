import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExistingUserDTO } from 'src/user/dtos/existing-user.dto';
import { NewUserDTO } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async Register(@Body() user: NewUserDTO): Promise<UserDetails | null> {
    return this.authService.Register(user);
  }

  @Post('Login')
  @HttpCode(HttpStatus.OK)
  async Login(
    @Body() existingUser: ExistingUserDTO,
  ): Promise<{ token: string } | any> {
    return await this.authService.login(existingUser);
  }
}
