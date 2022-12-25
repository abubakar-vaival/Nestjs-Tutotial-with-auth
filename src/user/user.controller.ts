import { Controller, Get, Param } from '@nestjs/common';
import { UserDetails } from './user-details.interface';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getuserbyid/:id')
  async getUserbyId(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.findbyId(id);
  }
}
