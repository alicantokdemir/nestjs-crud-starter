import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ITransactionManager } from './transaction-manager';
import { MikroOrmTransactionManager } from '../infrastructure/mikroorm/mikroorm-transaction-manager';
import mikroOrmConfig from '../infrastructure/mikroorm/mikroorm.config';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig as unknown as MikroOrmModuleSyncOptions),
  ],
  controllers: [],
  providers: [
    {
      provide: ITransactionManager,
      useClass: MikroOrmTransactionManager,
    },
  ],
  exports: [ITransactionManager],
})
export class CommonModule {}
