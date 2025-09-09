import { Logger } from '@nestjs/common';

export abstract class Migration {
  private readonly logger = new Logger(this.constructor.name);

  abstract up(): Promise<void>;
  abstract down(): Promise<void>;

  protected log(message: string) {
    this.logger.log(message);
  }
}
