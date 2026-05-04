export class EntityManager {
  fork(): this {
    return this;
  }

  transactional<T>(callback: (em: EntityManager) => Promise<T> | T): Promise<T> {
    return Promise.resolve(callback(this));
  }

  async execute(): Promise<unknown> {
    return 1;
  }

  create<T>(entityClass: new () => T, data: Partial<T>): T {
    return Object.assign(new entityClass(), data);
  }

  async persistAndFlush(): Promise<void> {
    return;
  }

  async flush(): Promise<void> {
    return;
  }

  async find(): Promise<unknown[]> {
    return [];
  }

  async findOne(): Promise<null> {
    return null;
  }

  async nativeDelete(): Promise<number> {
    return 0;
  }

  async count(): Promise<number> {
    return 0;
  }
}

export type FilterQuery<T> = Partial<T>;
