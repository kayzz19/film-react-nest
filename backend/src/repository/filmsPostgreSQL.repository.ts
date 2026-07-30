import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { FilmDTO, ScheduleDTO } from '../films/dto/films.dto';
import { FilmEntity } from '../films/entity/film.entity';
import { ScheduleEntity } from '../films/entity/schedule.entity';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsPostgreSQLRepository implements FilmsRepository {
  constructor(
  @InjectRepository(FilmEntity)
  private readonly filmRepository: Repository<FilmEntity>,

  @InjectRepository(ScheduleEntity)
  private readonly scheduleRepository: Repository<ScheduleEntity>,

  @InjectDataSource()
  private readonly dataSource: DataSource,
) {}

  private getFilmMapperFn(): (film: FilmEntity) => FilmDTO {
    return (film: FilmEntity): FilmDTO => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags ? film.tags.split(',') : [],
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedule.map(this.getScheduleMapperFn()),
    });
  }

  private getScheduleMapperFn(): (schedule: ScheduleEntity) => ScheduleDTO {
    return (schedule: ScheduleEntity): ScheduleDTO => ({
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken ? schedule.taken.split(',') : [],
    });
  }

  async findAllFilms(): Promise<{ total: number; items: FilmDTO[] }> {
    const items = await this.filmRepository.find({
      relations: ['schedule'],
    });

    return {
      total: items.length,
      items: items.map(this.getFilmMapperFn()),
    };
  }

  async findAllSchedulesById(
    filmId: string,
  ): Promise<{ total: number; items: ScheduleDTO[] }> {
    const film = await this.filmRepository.findOne({
      where: {
        id: filmId,
      },
      relations: ['schedule'],
    });

    if (!film) {
      throw new NotFoundException(`Фильм с id=${filmId} не найден`);
    }

    return {
      total: film.schedule.length,
      items: film.schedule.map(this.getScheduleMapperFn()),
    };
  }

  async findFilmById(filmId: string): Promise<FilmDTO> {
    const film = await this.filmRepository.findOne({
      where: {
        id: filmId,
      },
      relations: ['schedule'],
    });

    if (!film) {
      throw new NotFoundException(`Фильм с id=${filmId} не найден`);
    }

    return this.getFilmMapperFn()(film);
  }

  async findSchedulesById(
    filmId: string,
    scheduleId: string,
  ): Promise<ScheduleDTO> {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
        filmId,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Сеанс ${scheduleId} не найден`);
    }

    return this.getScheduleMapperFn()(schedule);
  }

  async checkPlace(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<boolean> {
    const schedule = await this.findSchedulesById(filmId, scheduleId);

    return schedule.taken.includes(place);
  }

  async updatePlaces(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
        filmId,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Сеанс ${scheduleId} не найден`);
    }

    try {
      const taken = schedule.taken ? schedule.taken.split(',') : [];

      taken.push(place);

      schedule.taken = taken.join(',');

      await this.scheduleRepository.save(schedule);
    } catch {
      throw new InternalServerErrorException(
        'Ошибка обновления списка занятых мест',
      );
    }
  }
}