/**
 * Create new type by merging
 * existing type with other types
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
