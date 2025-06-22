import { BaseModelProps } from '../base/model.base';

// export type OmitBaseProps<T, K extends keyof T> = Omit<T, K>;
export type OmitBaseProps<T> = Omit<T, keyof BaseModelProps>;
