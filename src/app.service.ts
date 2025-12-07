import { Injectable } from '@nestjs/common';
import { LoggerService } from './loggers/logger.service';
import { EntityManager } from '@mikro-orm/sqlite';

@Injectable()
export class AppService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly em: EntityManager,
  ) {
    this.loggerService.setContext(AppService.name);
  }

  async health() {
    this.loggerService.log('Health endpoint called');

    return { status: 'ok' };
  }

  async ready() {
    this.loggerService.log('Ready endpoint called');
    try {
      await this.em.execute('SELECT 1');
      return { status: 'ok' };
    } catch (error) {
      this.loggerService.error('Database connection failed', error);
      return { status: 'error' };
    }
  }
}
