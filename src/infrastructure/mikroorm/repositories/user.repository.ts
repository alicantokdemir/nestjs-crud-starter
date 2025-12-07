import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
import { IUserRepository } from '../../../users/user.types';
import { Injectable } from '@nestjs/common';
import { User } from '../../../users/entities/user.entity';
import { UserEntity } from '../entities/user.entity';
import { BaseMikroormRepository } from './base.repository';

@Injectable()
export class UserRepository
  extends BaseMikroormRepository<UserEntity, User>
  implements IUserRepository
{
  constructor(protected readonly em: EntityManager) {
    super(em, UserEntity);
  }

  protected mapDomainFilterToOrm(
    filter: Partial<User>,
  ): FilterQuery<UserEntity> {
    const ormFilter: Partial<UserEntity> = {};

    for (const [key, value] of Object.entries(filter)) {
      ormFilter[key] = value;
    }

    return ormFilter;
  }

  protected mapDomainToOrm(user: User): UserEntity {
    const entity = new UserEntity();
    if (user.id) {
      entity.id = user.id;
    }
    entity.provider = user.provider;
    entity.providerId = user.providerId;
    entity.email = user.email;
    entity.name = user.name;
    entity.picture = user.picture;
    entity.status = user.status;

    return entity;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }
}
