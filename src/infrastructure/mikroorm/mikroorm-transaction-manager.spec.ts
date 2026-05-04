import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EntityManager } from '@mikro-orm/sqlite';
import { MikroOrmTransactionManager } from './mikroorm-transaction-manager';

describe('MikroOrmTransactionManager', () => {
  let transactionManager: MikroOrmTransactionManager;
  let em: any;
  let forkedEm: any;

  beforeEach(() => {
    forkedEm = {
      transactional: jest.fn(),
    };

    em = {
      fork: jest.fn().mockReturnValue(forkedEm),
    };

    transactionManager = new MikroOrmTransactionManager(em as EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should run the operation in a forked transactional entity manager', async () => {
    const operation = jest.fn(() => Promise.resolve('result')) as any;
    const transactionalMock = forkedEm.transactional as any;
    transactionalMock.mockImplementation(async (callback: any) => callback(forkedEm as EntityManager));

    const result = await transactionManager.runInTransaction(operation);

    expect(em.fork).toHaveBeenCalledTimes(1);
    expect(forkedEm.transactional).toHaveBeenCalledTimes(1);
    expect(operation).toHaveBeenCalledWith(forkedEm);
    expect(result).toBe('result');
  });

  it('should propagate transactional errors', async () => {
    const error = new Error('transaction failed');
    const transactionalMock = forkedEm.transactional as any;
    transactionalMock.mockRejectedValue(error);

    await expect(
      transactionManager.runInTransaction(jest.fn() as any),
    ).rejects.toThrow(error);

    expect(em.fork).toHaveBeenCalledTimes(1);
    expect(forkedEm.transactional).toHaveBeenCalledTimes(1);
  });
});