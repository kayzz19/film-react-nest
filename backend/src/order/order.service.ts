import { BadRequestException, Injectable } from '@nestjs/common';
import { orderDTO, ticketDTO } from './dto/order.dto';
import { FilmsMongoDbRepository } from 'src/repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsMongoDbRepository) {}

  async createOrder(
    orderData: orderDTO,
  ): Promise<{ items: ticketDTO[]; total: number }> {
    const tickets = orderData.tickets;
    for (const ticket of tickets) {
      await this.filmsRepository.findSchedulesById(ticket.film, ticket.session);
      const place = `${ticket.row}:${ticket.seat}`;
      if (
        await this.filmsRepository.checkPlace(
          ticket.film,
          ticket.session,
          place,
        )
      ) {
        throw new BadRequestException(`Место ${place} уже забронировано`);
      }
      this.filmsRepository.updatePlaces(ticket.film, ticket.session, place);
    }
    return { items: tickets, total: tickets.length };
  }
}
