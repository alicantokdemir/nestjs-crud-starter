import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { ITransactionManager } from '../../common/transaction-manager';

@Injectable()
export class MikroOrmTransactionManager implements ITransactionManager {
  constructor(private readonly em: EntityManager) {}

  async runInTransaction<T>(
    operation: (em: EntityManager) => Promise<T>,
  ): Promise<T> {
    return this.em.fork().transactional(operation);
  }
}
