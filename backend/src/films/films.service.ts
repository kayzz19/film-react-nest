import { Inject, Injectable } from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async getAllFilms() {
    return this.filmsRepository.findAllFilms();
  }

  async getScheduleFilm(id: string) {
    return this.filmsRepository.findAllSchedulesById(id);
  }
}