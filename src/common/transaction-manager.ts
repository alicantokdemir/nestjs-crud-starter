export interface ITransactionManager<TTransactionContext = unknown> {
  runInTransaction<T>(
    operation: (context: TTransactionContext) => Promise<T>,
  ): Promise<T>;
}

export const ITransactionManager = Symbol('ITransactionManager');
