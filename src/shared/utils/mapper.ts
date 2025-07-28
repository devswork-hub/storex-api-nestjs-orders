export type MapperType<Contract, Entity> = {
  toDomain(input: Entity): Contract;
};
