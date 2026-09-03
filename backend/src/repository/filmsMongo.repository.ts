import { Injectable } from '@nestjs/common';
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
      if (!root) return null;
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

  async findFilmById(filmId: string): Promise<filmDTO | null> {
    const film = await this.filmModel.findOne({ id: filmId });
    if (!film) return null;
    return this.getFilmMapFn()(film);
  }

  async findAllSchedulesById(
    filmId: string,
  ): Promise<{ total: number; items: scheduleDTO[] } | null> {
    const film = await this.findFilmById(filmId);
    if (!film) return null;

    const schedule = film.schedule || [];
    return {
      total: schedule.length,
      items: schedule.map(this.getScheduleMapFn()),
    };
  }

  async findScheduleById(
    filmId: string,
  ): Promise<{ total: number; items: scheduleDTO[] } | null> {
    const film = await this.filmModel.findOne({ id: filmId });
    if (!film) return null;

    const schedule = film.schedule || [];
    return {
      total: schedule.length,
      items: schedule.map(this.getScheduleMapFn()),
    };
  }

  async findSchedulesById(
    filmId: string,
    scheduleId: string,
  ): Promise<scheduleDTO | null> {
    const schedules = await this.findAllSchedulesById(filmId);
    if (!schedules) return null;

    const schedule = schedules.items.find((el) => el.id === scheduleId);
    return schedule || null;
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
