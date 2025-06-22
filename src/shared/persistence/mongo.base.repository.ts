export abstract class MongoBaseRepository<T> {
  protected abstract collectionName: string;

  constructor(protected readonly db: any) {}

  async findOne(query: object): Promise<T | null> {
    return this.db.collection(this.collectionName).findOne(query);
  }

  async findAll(query: object = {}): Promise<T[]> {
    return this.db.collection(this.collectionName).find(query).toArray();
  }

  async insertOne(document: T): Promise<void> {
    await this.db.collection(this.collectionName).insertOne(document);
  }

  async updateOne(query: object, update: object): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .updateOne(query, { $set: update });
  }

  async deleteOne(query: object): Promise<void> {
    await this.db.collection(this.collectionName).deleteOne(query);
  }
}
