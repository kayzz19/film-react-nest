import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { FilmsMongoDbRepository } from '../repository/films.repository';
import { Film, FilmSchema } from '../films/schema/films.schema';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('DATABASE_URL'),
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }),
          inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
      ],
      providers: [FilmsMongoDbRepository],
      exports: [FilmsMongoDbRepository],
    };
  }
}
