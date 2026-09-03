export class orderDTO {
  phone: string;
  email: string;
  tickets: ticketDTO[];
}

export class ticketDTO {
  film: string;
  session: string;
  daytime: string;
  day: string;
  time: string;
  row: number;
  seat: number;
  price: number;
}
