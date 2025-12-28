import { SetMetadata } from '@nestjs/common';
export const IDEMPOTENT_KEY = 'IDEMPOTENT_MUTATION';
export const Idempotent = () => SetMetadata(IDEMPOTENT_KEY, true);
