import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { FilmsRepository } from '../repository/films.repository';
import { OrderDTO } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async createOrder(
    orderData: OrderDTO,
  ): Promise<{ items: unknown[]; total: number }> {
    const bookedPlaces = new Set<string>();

    for (const ticket of orderData.tickets) {
      await this.filmsRepository.findSchedulesById(
        ticket.film,
        ticket.session,
      );

      const place = `${ticket.row}:${ticket.seat}`;

      if (bookedPlaces.has(place)) {
        throw new BadRequestException(
          `Место ${place} повторяется в заказе`,
        );
      }

      bookedPlaces.add(place);

      const taken = await this.filmsRepository.checkPlace(
        ticket.film,
        ticket.session,
        place,
      );

      if (taken) {
        throw new BadRequestException(
          `Место ${place} уже занято`,
        );
      }
    }

    for (const ticket of orderData.tickets) {
      await this.filmsRepository.updatePlaces(
        ticket.film,
        ticket.session,
        `${ticket.row}:${ticket.seat}`,
      );
    }

    const items = orderData.tickets.map((ticket) => ({
      id: randomUUID(),
      ...ticket,
    }));

    return {
      total: items.length,
      items,
    };
  }
}