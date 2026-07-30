import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntity } from '../films/entity/film.entity';
import { ScheduleEntity } from '../films/entity/schedule.entity';

import { FilmsPostgreSQLRepository } from '../repository/filmsPostgreSQL.repository';

@Module({})
export class DatabaseModule {
  static registerAsync(): DynamicModule {
    return {
      module: DatabaseModule,

      imports: [
        ConfigModule,

        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',

            url: config.getOrThrow<string>('DATABASE_URL'),

            entities: [FilmEntity, ScheduleEntity],

            synchronize: false,
          }),
        }),

        TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
      ],

      providers: [
        FilmsPostgreSQLRepository,
        {
          provide: 'FILMS_REPOSITORY',
          useClass: FilmsPostgreSQLRepository,
        },
      ],

      exports: ['FILMS_REPOSITORY'],
    };
  }
}