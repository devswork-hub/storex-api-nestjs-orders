// // src/shared/commands/base.command.ts
// import { Logger } from '@nestjs/common';
// import { Command, ICommand } from '@nestjs/cqrs';

// // Define a interface para o comando (opcional, mas boa prática)
// export abstract class BaseCommand implements ICommand {
//   // Você pode adicionar propriedades comuns aqui, se necessário
// }

// type ICommandHandler<TCommand extends ICommand = any, TResult = any> =
//   TCommand extends Command<infer InferredCommandResult>
//     ? {
//         execute(command: TCommand): Promise<InferredCommandResult>;
//       }
//     : {
//         execute(command: TCommand): Promise<TResult>;
//       };

// // Classe abstrata que lida com o logger
// // T é o tipo do comando, R é o tipo do retorno
// export abstract class BaseCommandHandler<T extends BaseCommand, R = any>
//   implements ICommandHandler<T, R>
// {
//   protected readonly logger: Logger;

//   // O construtor recebe o "constructor" da classe que o estenderá
//   // 'new.target.name' é a forma de obter o nome da classe em tempo de execução
//   constructor() {
//     this.logger = new Logger(this.constructor.name);
//   }

//   // O método execute deve ser implementado nas classes filhas
//   public abstract execute(command: T): Promise<R>;
// }
