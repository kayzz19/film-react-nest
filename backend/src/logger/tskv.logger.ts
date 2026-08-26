import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: string, ...optionalParams: unknown[]) {
    return `level=${level}\tmessage=${message}\toptionalParams=${optionalParams}`;
  }

  log(message: string, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  error(message: string, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, optionalParams));
  }

  warn(message: string, ...optionalParams: unknown[]) {
    console.warn(this.formatMessage('warn', message, optionalParams));
  }
}
