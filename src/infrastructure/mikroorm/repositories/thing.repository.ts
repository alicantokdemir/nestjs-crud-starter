import { ThingEntity } from '../entities/thing.entity';
import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
import { EntityData, RequiredEntityData } from '@mikro-orm/core';
import { Thing } from '../../../things/entities/thing.entity';
import { Injectable } from '@nestjs/common';
import { IThingRepository } from '../../../things/things.types';
import { BaseMikroormRepository } from './base.repository';

@Injectable()
export class ThingRepository
  extends BaseMikroormRepository<ThingEntity, Thing>
  implements IThingRepository
{
  constructor(protected readonly em: EntityManager) {
    super(em, ThingEntity);
  }

  protected mapDomainFilterToOrm(
    filter?: Partial<Thing>,
  ): FilterQuery<ThingEntity> {
    const ormFilter: Partial<ThingEntity> = { ...filter };

    return ormFilter;
  }

  protected mapDomainToOrm(thing: Thing): RequiredEntityData<ThingEntity> {
    return {
      data: thing.data,
    } as RequiredEntityData<ThingEntity>;
  }

  protected mapDomainUpdateToOrm(update: Partial<Thing>): EntityData<ThingEntity> {
    const ormUpdate: EntityData<ThingEntity> = {};

    if (update.data !== undefined) {
      ormUpdate.data = update.data;
    }

    return ormUpdate;
  }
}
