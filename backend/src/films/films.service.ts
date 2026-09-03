import { Injectable, Inject } from '@nestjs/common';
import { FilmsMongoDbRepository } from '../repository/filmsMongo.repository';
import { FilmsPostgreSQLRepository } from '../repository/filmsPostgreSQL.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository:
      | FilmsMongoDbRepository
      | FilmsPostgreSQLRepository,
  ) {}

  async getAllFilms() {
    return this.filmsRepository.findAllFilms();
  }

  async getScheduleFilm(id: string) {
    return await this.filmsRepository.findAllSchedulesById(id);
  }
}
