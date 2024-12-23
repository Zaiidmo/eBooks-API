import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBConfigService } from './config/dynamodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DynamoDBConfigService],
  exports: [DynamoDBConfigService],
})
export class AppModule {}
