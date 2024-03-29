export interface DefaultCrudRepository<DSource, T> {
  dataSource: Promise<DSource>;
  findAll(): Promise<T[]>;
  findById(key: string): Promise<T>;
  create(data: T): Promise<T>;
  update(key: string, data: Partial<T>): Promise<void>;
  delete(key: string): Promise<void>;
}
