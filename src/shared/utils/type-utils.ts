export type ChangeTo<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
};

// TODO: mover para o local adequado
// export function delay(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// export function formatCurrency(amount: number): string {
//   return new Intl.NumberFormat('pt-BR', {
//     style: 'currency',
//     currency: 'BRL',
//   }).format(amount);
// }
