import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './loggers/logger.service';
import { mockLoggerService } from '../test/mocks/loggerService';
import { EntityManager } from '@mikro-orm/sqlite';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: EntityManager,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return status ok on health', async () => {
      expect(await appController.health()).toEqual({ status: 'ok' });
    });
  });
});
