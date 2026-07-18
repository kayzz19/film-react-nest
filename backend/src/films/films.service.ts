import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsMongoDbRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsMongoDbRepository) {}

  async getAllFilms() {
    return this.filmsRepository.findAllFilms();
  }

  async getScheduleFilm(id: string) {
    const result = await this.filmsRepository.findScheduleById(id);
    if (!result) {
      throw new NotFoundException(`Фильм с ID ${id} не найден`);
    }
    return result;
  }
}
