import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
import { EntityData, RequiredEntityData } from '@mikro-orm/core';
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
    filter?: Partial<User>,
  ): FilterQuery<UserEntity> {
    const ormFilter: Partial<UserEntity> = {};

    for (const [key, value] of Object.entries(filter ?? {})) {
      ormFilter[key] = value;
    }

    return ormFilter;
  }

  protected mapDomainToOrm(user: User): RequiredEntityData<UserEntity> {
    return {
      ...(user.id ? { id: user.id } : {}),
      provider: user.provider,
      providerId: user.providerId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      status: user.status,
    } as RequiredEntityData<UserEntity>;
  }

  protected mapDomainUpdateToOrm(update: Partial<User>): EntityData<UserEntity> {
    const ormUpdate: EntityData<UserEntity> = {};

    if (update.provider !== undefined) {
      ormUpdate.provider = update.provider;
    }
    if (update.providerId !== undefined) {
      ormUpdate.providerId = update.providerId;
    }
    if (update.email !== undefined) {
      ormUpdate.email = update.email;
    }
    if (update.name !== undefined) {
      ormUpdate.name = update.name;
    }
    if (update.picture !== undefined) {
      ormUpdate.picture = update.picture;
    }
    if (update.status !== undefined) {
      ormUpdate.status = update.status;
    }

    return ormUpdate;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }
}
