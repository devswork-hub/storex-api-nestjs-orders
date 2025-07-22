import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RequestifyService {
  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string): Promise<AxiosResponse> {
    const response = await firstValueFrom(this.httpService.get<T>(url));
    return response;
  }
}
