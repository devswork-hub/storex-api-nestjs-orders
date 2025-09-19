import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { Request } from 'express';

import { getMethod, getOrigin, getPath } from './request.utils';

export interface ICorsOptions {
  allowed_origins: string[];
  allowed_methods: string[];
  credentials: boolean;
  allowed_paths?: string[];
}

export const CorsMiddleware =
  (options: ICorsOptions): CorsOptionsDelegate<Request> =>
  (req, callback) => {
    const cors_options: CorsOptions = {
      methods: options.allowed_methods,
      credentials: options.credentials,
      origin: false,
    };

    const origin = getOrigin(req);

    // if (!origin || whiteList.indexOf(origin) !== -1) {
    //   callback(null, { preflightContinue: true }); // Allow the request
    // } else {
    //   callback(new Error('Not allowed by CORS')); // Deny the request
    // }

    const method = getMethod(req);
    const path = getPath(req);

    const originAllowed =
      !origin ||
      options.allowed_origins.length === 0 ||
      options.allowed_origins.includes(origin);

    const methodAllowed =
      options.allowed_methods.length === 0 ||
      options.allowed_methods.includes(method);

    const pathAllowed =
      options.allowed_paths.length === 0 ||
      options.allowed_paths.includes(path);

    if (originAllowed && methodAllowed && pathAllowed) {
      cors_options.origin = true;
      return callback(null, cors_options);
    }

    // erro mais descritivo
    const reasons = [];
    if (!originAllowed) reasons.push(`Origin "${origin}" not allowed`);
    if (!methodAllowed) reasons.push(`Method "${method}" not allowed`);
    if (!pathAllowed) reasons.push(`Path "${path}" not allowed`);

    return callback(
      new Error(`CORS_NOT_ALLOWED: ${reasons.join(', ')}`),
      cors_options,
    );
  };
