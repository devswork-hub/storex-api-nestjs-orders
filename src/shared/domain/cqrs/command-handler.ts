export interface CommandHandler<Input, Output> {
  execute(command: Input): Output | Promise<Output>;
}
