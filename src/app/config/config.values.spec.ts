import { ConfigValues } from './config.values';
import { ConfigService } from '@nestjs/config';

describe('ConfigValues', () => {
  let service: ConfigValues;

  beforeEach(() => {
    const mockConfigService = {
      getOrThrow: jest.fn((key: string) => {
        const values = { APP_PORT: '3000', NODE_ENV: 'development' };
        return values[key as keyof typeof values];
      }),
    } as unknown as ConfigService;

    service = new ConfigValues(mockConfigService);
  });

  it('retorna valor existente', () => {
    expect(service.get('APP_PORT')).toBe('3000');
  });

  it('lança erro se chave não existir', () => {
    const configService = new ConfigValues({
      getOrThrow: () => {
        throw new Error('Missing key');
      },
    } as any);

    expect(() => configService.get('MONGODB_HOST')).toThrow('Missing key');
  });
});
