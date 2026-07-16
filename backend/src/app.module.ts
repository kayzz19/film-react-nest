import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configProvider } from './app.config.provider';
import * as path from 'node:path';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      renderPath: '/content/afisha/',
    }),
    DatabaseModule.register(),
    DatabaseModule,
  ],
  controllers: [FilmsController, OrderController],
  providers: [configProvider, FilmsService, OrderService],
})
export class AppModule {}
