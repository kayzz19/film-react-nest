import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsMongoDbRepository } from '../repository/filmsMongo.repository';
import { FilmsPostgreSQLRepository } from '../repository/filmsPostgreSQL.repository';
import { applicationConfig } from '../app.config.provider';
import { Film, FilmSchema } from '../films/schema/films.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from '../films/entity/schedule.entity';
import { FilmEntity } from '../films/entity/film.entity';

@Module({})
export class DatabaseModule {
  static register(dbms: string): DynamicModule {
    const providers = [];
    const imports = [];

    console.log('DATABASE_URL=', process.env.DATABASE_URL);
    console.log('DATABASE_USERNAME=', process.env.DATABASE_USERNAME);
    console.log('DATABASE_PASSWORD=', process.env.DATABASE_PASSWORD);

    switch (dbms) {
      case 'mongodb':
        imports.push(MongooseModule.forRoot(applicationConfig.DATABASE_URL));
        imports.push(
          MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
        );
        providers.push({
          provide: 'FILMS_REPOSITORY',
          useClass: FilmsMongoDbRepository,
        });
        providers.push(FilmsMongoDbRepository);
        break;

      case 'postgres':
        imports.push(
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgres',
            port: 5432,
            username: 'prac',
            password: 'prac',
            database: 'prac',
            entities: [FilmEntity, ScheduleEntity],
            synchronize: false,
          }),
        );
        imports.push(TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]));
        providers.push({
          provide: 'FILMS_REPOSITORY',
          useClass: FilmsPostgreSQLRepository,
        });
        providers.push(FilmsPostgreSQLRepository);
        break;
    }
    return {
      module: DatabaseModule,
      imports: imports,
      providers: providers,
      exports: providers,
    };
  }
}
