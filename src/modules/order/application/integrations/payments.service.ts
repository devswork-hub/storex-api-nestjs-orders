import { Injectable } from '@nestjs/common';
// import { AxiosResponse } from 'axios';
// import { PaymentOutput } from './payment.output'; // O tipo que representa os dados do pagamento externo

@Injectable()
export class PaymentService {
  // constructor(private readonly httpService: HttpService) {}

  async fetchPaymentDetailsFromExternalApi(
    paymentId: string,
    // ): Promise<PaymentOutput | null> {
  ): Promise<null> {
    try {
      // Substitua pela URL real da sua API externa de pagamentos
      // const response: AxiosResponse<PaymentOutput> = await this.httpService
      //   .get(`https://api.sua-plataforma-pagamento.com/payments/${paymentId}`)
      //   .toPromise();

      // return response.data;
      return null;
    } catch (error) {
      console.error(
        `Erro ao buscar detalhes do pagamento ${paymentId}:`,
        error.message,
      );
      // Retorne null ou lance um erro específico, dependendo da sua necessidade
      return null;
    }
  }
}
