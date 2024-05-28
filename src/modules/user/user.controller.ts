import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { UserEntity } from 'src/entities/user.entity';
import { CreateUserRequestDto } from 'src/modules/user/dto/create-user.request.dto';

import { UserService } from './user.service';

const CONTROLLER_NAME = 'user';

@Controller(CONTROLLER_NAME)
@ApiTags(CONTROLLER_NAME)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserRequestDto): Promise<UserEntity> {
    return this.userService.createUser(body.email);
  }

  @Get(':email')
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<UserEntity | undefined> {
    return this.userService.findByEmail(email);
  }
}
