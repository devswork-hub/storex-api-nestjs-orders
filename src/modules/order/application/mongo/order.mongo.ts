import { ChangeTo } from '@/src/app/utils/type';
import { OrderModelContract } from '../../order';

type OrderMongoContract = ChangeTo<OrderModelContract, {}>;
export class OrderMongo {}
