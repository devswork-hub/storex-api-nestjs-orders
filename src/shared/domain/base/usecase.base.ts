export interface BaseUseCaseContract<Input, Output> {
  execute(input: Input): Promise<Output>;
}
