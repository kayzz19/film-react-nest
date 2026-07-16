import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { orderDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  createOrder(@Body() orderData: orderDTO) {
    return this.orderService.createOrder(orderData);
  }
}
