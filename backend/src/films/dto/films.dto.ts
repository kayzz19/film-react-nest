//TODO описать DTO для запросов к /films
export class filmDTO {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: scheduleDTO[];
}

export class scheduleDTO {
  id: string;
  daytime: Date;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}
