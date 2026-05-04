import {
  EntityClass,
  EntityData,
  EntityManager,
  FilterQuery,
  Loaded,
  OrderDefinition,
  RequiredEntityData,
} from '@mikro-orm/core';
import {
  IBaseRepository,
  IdType,
  PaginationOptions,
} from '../../../common/base.repository';

export abstract class BaseMikroormRepository<
  DbEntity extends { id: IdType; toObject: () => DomainEntity },
  DomainEntity,
> implements IBaseRepository<DomainEntity>
{
  protected constructor(
    protected em: EntityManager,
    protected readonly dbEntity: EntityClass<DbEntity>,
  ) {}

  withEm(em: EntityManager): this {
    const repo = Object.create(Object.getPrototypeOf(this)) as this;

    Object.assign(repo, this);
    repo.em = em;

    return repo;
  }

  protected abstract mapDomainFilterToOrm(
    filter?: Partial<DomainEntity>,
  ): FilterQuery<DbEntity>;

  protected abstract mapDomainToOrm(
    entity: DomainEntity,
  ): RequiredEntityData<DbEntity>;

  protected abstract mapDomainUpdateToOrm(
    update: Partial<DomainEntity>,
  ): EntityData<DbEntity>;

  async create(newObj: DomainEntity): Promise<DomainEntity> {
    const entity = this.em.create(this.dbEntity, this.mapDomainToOrm(newObj));

    await this.em.persistAndFlush(entity);

    return this.toDomain(entity);
  }

  async findAllUnpaginated(
    filter?: Partial<DomainEntity>,
  ): Promise<DomainEntity[]> {
    const entities = await this.em.find(
      this.dbEntity,
      this.mapDomainFilterToOrm(filter),
    );

    return entities.map((entity) => this.toDomain(entity));
  }

  async findAllPaginated(
    pagination: PaginationOptions,
    filter?: Partial<DomainEntity>,
  ): Promise<DomainEntity[]> {
    const entities = await this.em.find(
      this.dbEntity,
      this.mapDomainFilterToOrm(filter),
      {
        limit: pagination.limit,
        offset: pagination.offset,
        orderBy: {
          [pagination.sortBy]: pagination.sortOrder,
        } as OrderDefinition<DbEntity>,
      },
    );

    return entities.map((entity) => this.toDomain(entity));
  }

  async findOne(filter: Partial<DomainEntity>): Promise<DomainEntity | null> {
    if (Object.keys(filter).length === 0) {
      throw new Error('findOne requires a non-empty filter');
    }

    const entity = await this.em.findOne(
      this.dbEntity,
      this.mapDomainFilterToOrm(filter),
    );

    return entity ? this.toDomain(entity) : null;
  }

  async findOneById(id: IdType): Promise<DomainEntity | null> {
    const entity = await this.em.findOne(this.dbEntity, this.idFilter(id));

    return entity ? this.toDomain(entity) : null;
  }

  async update(
    id: IdType,
    updateObj: Partial<DomainEntity>,
  ): Promise<DomainEntity> {
    const entity = await this.em.findOne(this.dbEntity, this.idFilter(id));

    if (!entity) {
      throw new Error(`${this.dbEntity.name} with id ${String(id)} not found`);
    }

    Object.assign(entity, this.mapDomainUpdateToOrm(updateObj));

    await this.em.flush();

    return this.toDomain(entity);
  }

  async removeAll(filter?: Partial<DomainEntity>): Promise<number> {
    return this.em.nativeDelete(
      this.dbEntity,
      this.mapDomainFilterToOrm(filter),
    );
  }

  async remove(id: IdType): Promise<boolean> {
    const deleted = await this.em.nativeDelete(
      this.dbEntity,
      this.idFilter(id),
    );

    return deleted > 0;
  }

  async count(filter?: Partial<DomainEntity>): Promise<number> {
    return this.em.count(this.dbEntity, this.mapDomainFilterToOrm(filter));
  }

  private toDomain(entity: Loaded<DbEntity> | DbEntity): DomainEntity {
    return entity.toObject();
  }

  private idFilter(id: IdType): FilterQuery<DbEntity> {
    return { id } as FilterQuery<DbEntity>;
  }
}
