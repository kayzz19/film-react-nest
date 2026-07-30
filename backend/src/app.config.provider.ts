import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule],
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.getOrThrow<string>('DATABASE_DRIVER'),
      url: configService.getOrThrow<string>('DATABASE_URL'),
    },
    port: configService.get<number>('PORT') ?? 3000,
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
  port: number;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}