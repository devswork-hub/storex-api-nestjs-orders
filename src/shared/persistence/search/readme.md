```ts
// type Entity = { id: string; name: string };
// const data: Entity[] = [
//   { id: '1', name: 'Banana' },
//   { id: '2', name: 'Maçã' },
//   { id: '3', name: 'Laranja' },
//   { id: '4', name: 'Abacaxi' },
//   { id: '5', name: 'Uva' },
//   { id: '6', name: 'Kiwi' },
//   { id: '7', name: 'Pera' },
// ];

// const repo: SearchableRepositoryContract<Entity> = {
//   async search({ filter, sort, pagination }: SearchOptions<Entity>) {
//     let results = [...data];

//     // 🎯 Filtro por nome (parcial, case-insensitive)
//     if (filter?.name) {
//       results = results.filter((item) =>
//         item.name.toLowerCase().includes(filter.name.toLowerCase()),
//       );
//     }

//     // ↕️ Ordenação por campo
//     if (sort) {
//       results.sort((a, b) => {
//         const aValue = a[sort.field];
//         const bValue = b[sort.field];
//         if (typeof aValue === 'string' && typeof bValue === 'string') {
//           return sort.direction === 'asc'
//             ? aValue.localeCompare(bValue)
//             : bValue.localeCompare(aValue);
//         }
//         return 0;
//       });
//     }

//     // 📄 Paginação offset
//     if (pagination?.type === 'offset') {
//       const page = pagination.page ?? 1;
//       const limit = pagination.limit ?? 10;
//       const offset = (page - 1) * limit;
//       const paginated = results.slice(offset, offset + limit);

//       return {
//         type: 'offset',
//         items: paginated,
//         total: results.length,
//         currentPage: page,
//         perPage: limit,
//         lastPage: Math.ceil(results.length / limit),
//       } satisfies OffsetSearchResult<Entity>;
//     }

//     // 🔗 Paginação cursor
//     if (pagination?.type === 'cursor') {
//       const limit = pagination.limit ?? 5;
//       const startIndex = pagination.after
//         ? results.findIndex((item) => item.id === pagination.after) + 1
//         : 0;
//       const paginated = results.slice(startIndex, startIndex + limit);
//       const nextCursor =
//         startIndex + limit < results.length
//           ? (paginated[paginated.length - 1]?.id ?? null)
//           : null;

//       return {
//         type: 'cursor',
//         items: paginated,
//         total: results.length,
//         nextCursor,
//         hasNextPage: nextCursor !== null,
//       } satisfies CursorSearchResult<Entity>;
//     }

//     // ✅ Fallback: sem paginação => retorna todos os itens
//     return {
//       type: 'offset',
//       items: results,
//       total: results.length,
//       currentPage: 1,
//       perPage: results.length,
//       lastPage: 1,
//     } satisfies OffsetSearchResult<Entity>;
//   },
// };
```
