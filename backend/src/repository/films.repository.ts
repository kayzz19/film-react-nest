import { FilmDTO, ScheduleDTO } from '../films/dto/films.dto';

export interface FilmsRepository {
  findAllFilms(): Promise<{
    total: number;
    items: FilmDTO[];
  }>;

  findAllSchedulesById(
    id: string,
  ): Promise<{
    total: number;
    items: ScheduleDTO[];
  }>;

  findSchedulesById(
    filmId: string,
    scheduleId: string,
  ): Promise<ScheduleDTO>;

  checkPlace(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<boolean>;

  updatePlaces(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<void>;
}