import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduleDTO {
  @IsString()
  id: string;

  @IsString()
  daytime: string;

  @IsInt()
  @Min(1)
  hall: number;

  @IsInt()
  @Min(1)
  rows: number;

  @IsInt()
  @Min(1)
  seats: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  taken: string[];
}

export class FilmDTO {
  @IsString()
  id: string;

  @IsNumber()
  @Min(0)
  rating: number;

  @IsString()
  director: string;

  @IsArray()
  tags: string[];

  @IsString()
  image: string;

  @IsString()
  cover: string;

  @IsString()
  title: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDTO)
  schedule: ScheduleDTO[];
}