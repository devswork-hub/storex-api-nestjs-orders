// import { Injectable } from '@nestjs/common';
// import { AxiosResponse } from 'axios';

// export type AxiosMethod = () => Promise<AxiosResponse>;

// @Injectable()
// export class Retry {
//   constructor() {}

//   async retry(
//     axiosMethod: AxiosMethod,
//     retry: number,
//     delayInMs: number,
//     jitter: boolean,
//   ): Promise<AxiosResponse> {
//     try {
//       let res: AxiosResponse | null = null;

//       for (let i = 0; i <= retry; i++) {
//         try {
//           res = await axiosMethod();
//           break;
//         } catch (err) {
//           if (i < retry) {
//             const j = this.getJitter(jitter);
//             await this.executeWithDelay(delayInMs + j);
//             continue;
//           } else {
//             throw err;
//           }
//         }
//       }
//       return res;
//     } catch (error) {
//       throw error;
//     }
//   }

//   private executeWithDelay(delay: number) {
//     return new Promise((resolve) => setTimeout(resolve, delay));
//   }

//   private getJitter(jitter: boolean) {
//     return jitter ? Math.floor(Math.random() * (200 - 50 + 1)) + 50 : 0;
//   }
// }
