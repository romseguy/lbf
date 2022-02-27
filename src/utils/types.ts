import { IconProps } from "@chakra-ui/icons";
import { ComponentWithAs } from "@chakra-ui/system";
import { IconType } from "react-icons";

export type AppIcon = ComponentWithAs<"svg", IconProps> | IconType;
export interface AppQuery<T> {
  data?: T;
  isFetching: boolean;
  isLoading: boolean;
  refetch: () => void;
  error?: {
    status: number;
  };
}
export interface AppQueryWithData<T> extends AppQuery<T> {
  data: T;
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type PartialRequired<T, K extends keyof T> = Pick<Required<T>, K>;
// export type PartialRequired<T, Keys extends keyof T = keyof T> = Pick<
//   Partial<T>,
//   Exclude<keyof T, Keys>
// > & {
//   [K in Keys]: T[K];
// };
export type Primitive = string | number | boolean | symbol;
export type TypedMap<T extends string, K> = {
  [key in T]: K;
};
