// type ColumnType<S, I, U> = { id: S; name: I; u: U };

// export type Generated<T> =
//   T extends ColumnType<infer S, infer I, infer U>
//     ? ColumnType<S, I | undefined, U>
//     : ColumnType<T, T | undefined, T>;

// export type Timestamp = ColumnType<Date, Date | string, Date | string>;

// const d: Timestamp = {};
// d.id.getTime();
