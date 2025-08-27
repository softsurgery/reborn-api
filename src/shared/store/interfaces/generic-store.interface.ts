export interface GenericStore<T> {
  id: string;
  description?: string;
  value: T;
}
