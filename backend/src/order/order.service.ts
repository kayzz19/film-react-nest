import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      const schedule = await this.filmsRepository.findSchedulesById(
        ticket.film,
        ticket.session,
      );
      if (!schedule) {
        throw new NotFoundException(
          `Сеанс ${ticket.session} для фильма ${ticket.film} не найден`,
        );
      }
      const place = `${ticket.row}:${ticket.seat}`;
      const isPlaceTaken = await this.filmsRepository.checkPlace(
        ticket.film,
        ticket.session,
        place,
      );
      if (isPlaceTaken) {
        throw new BadRequestException(`Место ${place} уже забронировано`);
      }
      await this.filmsRepository.updatePlaces(
        ticket.film,
        ticket.session,
        place,
      );
    }
    return { items: tickets, total: tickets.length };
  }
}
