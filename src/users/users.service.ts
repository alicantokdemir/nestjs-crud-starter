import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from './user.types';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ITransactionManager } from '../common/transaction-manager';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOneByEmail(email);
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOneById(id);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.transactionManager.saveInTransaction(async () => {
      return this.userRepository.create(
        this.mapCreateUserDtoToUser(createUserDto),
      );
    });

    return user;
  }

  private mapCreateUserDtoToUser(createUserDto: CreateUserDto): User {
    return new User({
      id: undefined,
      provider: createUserDto.provider,
      providerId: createUserDto.providerId,
      email: createUserDto.email,
      name: createUserDto.name,
      picture: createUserDto.picture,
      status: createUserDto.status ?? UserStatus.PENDING_VERIFICATION, // Default status
    });
  }
}
