// import { StubClass } from '../../testing/stub';
// import { SearchableRepositoryContract } from './searchable.repository.contract';

// describe('SearchByCriteria', () => {
//   it('should execute criterias', async () => {
//     const repo: SearchableRepositoryContract<StubClass> = {
//       async search({
//         // pagination = {
//         //   type: 'offset',
//         //   page: 1,
//         //   limit: 10,
//         // },
//         sort,
//         filter,
//       }) {
//         let data = [...this.items];
//         if (filter) {
//           for (const [key, value] of Object.entries(filter)) {
//             data = data.filter(
//               (item) => item[key as keyof StubClass] === value,
//             );
//           }
//         }
//         if (sort) {
//           data.sort((a, b) => {
//             const aVal = a[sort.field];
//             const bVal = b[sort.field];
//             if (aVal === bVal) return 0;
//             return sort.direction === 'desc'
//               ? aVal > bVal
//                 ? -1
//                 : 1
//               : aVal > bVal
//                 ? 1
//                 : -1;
//           });
//         }
//         // const total = data.length;
//         // const start = (pagination.limit - 1) * perPage;
//         // const end = start + perPage;
//         // const items = data.slice(start, end);
//         // return {
//         //   items,
//         //   total,
//         //   currentPage: page,
//         //   perPage,
//         //   lastPage: Math.ceil(total / perPage),
//         // };
//         return null;
//       },
//       async searchByCriteria(criterias) {
//         let result = [...this.items];
//         for (const criteria of criterias) {
//           result = criteria.apply(result);
//         }
//         return {
//           items: result,
//           total: result.length,
//         };
//       },
//     };

//     console.log(repo.searchByCriteria([]));
//   });
// });
