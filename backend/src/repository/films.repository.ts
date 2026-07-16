import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { filmDTO, scheduleDTO } from '../films/dto/films.dto';
import { Film } from '../films/schema/films.schema';

@Injectable()
export class FilmsMongoDbRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  private getFilmMapFn(): (Film) => filmDTO {
    return (root) => {
      return {
        id: root.id,
        rating: root.rating,
        director: root.director,
        tags: root.tags,
        image: root.image,
        cover: root.cover,
        title: root.title,
        about: root.about,
        description: root.description,
        schedule: root.schedule,
      };
    };
  }

  private getScheduleMapFn(): (Schedule) => scheduleDTO {
    return (root) => {
      return {
        id: root.id,
        daytime: root.daytime,
        hall: root.hall,
        rows: root.rows,
        seats: root.seats,
        price: root.price,
        taken: root.taken,
      };
    };
  }

  async findAllFilms(): Promise<{ total: number; items: filmDTO[] }> {
    const items = await this.filmModel.find({});
    const total = await this.filmModel.countDocuments({});
    return {
      total,
      items: items.map(this.getFilmMapFn()),
    };
  }

  async findFilmById(filmId: string): Promise<filmDTO> {
    try {
      const film = await this.filmModel.findOne({ id: filmId });
      const mapper = this.getFilmMapFn();
      return mapper(film);
    } catch {
      throw new NotFoundException(`Фильм с ${filmId} не найден`);
    }
  }

  async findAllSchedulesById(
    filmId: string,
  ): Promise<{ total: number; items: scheduleDTO[] }> {
    const film = await this.findFilmById(filmId); //используем обычные методы Mongoose-документов
    const schedule = film.schedule;
    return {
      total: schedule.length,
      items: schedule.map(this.getScheduleMapFn()),
    };
  }

  async findScheduleById(
    filmId: string,
  ): Promise<{ total: number; items: scheduleDTO[] }> {
    const film = await this.filmModel.findOne({ id: filmId });
    const schedule = film.schedule;
    return {
      total: schedule.length,
      items: schedule.map(this.getScheduleMapFn()),
    };
  }

  async findSchedulesById(
    filmId: string,
    scheduleId: string,
  ): Promise<scheduleDTO> {
    const { items } = await this.findAllSchedulesById(filmId);
    const schedule = items.find((el) => el.id === scheduleId);
    if (!schedule) {
      throw new NotFoundException(`Сеанса с ${scheduleId} не найден`);
    }
    return schedule;
  }

  async checkPlace(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<boolean> {
    const res = await this.filmModel.find({
      id: filmId,
      schedule: {
        $elemMatch: {
          id: scheduleId,
          taken: place,
        },
      },
    });
    return Boolean(res.length);
  }

  async updatePlaces(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<void> {
    await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: scheduleId,
          },
        },
      },
      {
        $push: { 'schedule.$.taken': place },
      },
    );
  }
}
