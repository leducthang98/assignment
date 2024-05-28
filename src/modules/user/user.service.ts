import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { COMMON_CONSTANT } from 'src/constants/common.constant';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity, COMMON_CONSTANT.DATASOURCE_DEFAULT_NAMESPACE)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(email: string): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();
    user.email = email;

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
