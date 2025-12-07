import { Test, TestingModule } from '@nestjs/testing';
import { ThingsService } from './things.service';
import { IThingRepository } from './things.types';
import { ITransactionManager } from '../common/transaction-manager';
import { mockBaseRepository } from '../../test/mocks/baseRepository';
import { LoggerService } from '../loggers/logger.service';
import { mockLoggerService } from '../../test/mocks/loggerService';

describe('ThingsService', () => {
  let service: ThingsService;
  let mockThingRepository: IThingRepository = { ...mockBaseRepository };

  let mockTransactionManager: ITransactionManager = {
    saveInTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ThingsService,
        {
          provide: IThingRepository,
          useValue: mockThingRepository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    (mockTransactionManager.saveInTransaction as jest.Mock).mockImplementation(
      async (cb: any) => cb(),
    );

    service = module.get<ThingsService>(ThingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
