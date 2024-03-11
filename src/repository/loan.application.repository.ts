import Redis from 'ioredis';
import {DefaultCrudRepository} from '../interfaces';
import {generateRandomKey, safeJsonParse} from '../utils';
import {RedisClient} from '../datasource';
import {LoggerService} from '../services';
import {LoanApplication} from '../schemas';

export class LoanApplicationRepository
  implements DefaultCrudRepository<Redis, LoanApplication>
{
  dataSource: Promise<Redis>;
  logger: LoggerService;

  constructor() {
    this.logger = new LoggerService(LoanApplicationRepository.name);
    const dSource = new RedisClient();
    this.logger.info(`using ${RedisClient.name} connection`);
    this.dataSource = dSource.connect();
  }

  /**
   * findAll - retrieves list of loan applications
   * @returns Promise<LoanApplication[]> - list of loan applications
   */
  async findAll(): Promise<LoanApplication[]> {
    const data = [];

    // cursor based pagination that begins at 0
    let cursor = '0';

    // run scan untill all records are fetched
    // this can't be the best approach for large data sets
    do {
      // Scan the keyspace to fetch keys
      const [newCursor, keys] = await (await this.dataSource).scan(cursor);

      // Add the keys to the data array
      data.push(...keys);

      // Update the cursor for the next iteration
      cursor = newCursor;
    } while (cursor !== '0');

    // Fetch values for each key
    const result = await Promise.all(
      data.map(async key => {
        const loan = (await (await this.dataSource).get(key)) as string;
        return {id: key, ...safeJsonParse(loan, {})} as LoanApplication;
      })
    );

    return result;
  }

  /**
   * findById - retrieves loan application using loan id
   * @param loanApplicationId - loan application id
   * @returns Promise<LoanApplication>
   */
  async findById(loanApplicationId: string): Promise<LoanApplication> {
    const loan = await (await this.dataSource).get(loanApplicationId);
    return safeJsonParse(loan as string, {}) as LoanApplication;
  }

  /**
   * create - creates new loan
   * @param loanApplication - loan application data to create
   * @returns Promise<LoanApplication>
   */
  async create(loanApplication: LoanApplication): Promise<LoanApplication> {
    const loanApplicationId = generateRandomKey();
    (await this.dataSource).set(
      loanApplicationId,
      JSON.stringify(loanApplication)
    );
    return {id: loanApplicationId, ...loanApplication} as LoanApplication;
  }

  /**
   * update - update loanApplication by loan application id
   * @param loanApplicationId - loan application id
   * @param loanApplication - loan application data to update
   * @returns Promise<void>
   */
  async update(
    loanApplicationId: string,
    loanApplication: Partial<LoanApplication>
  ): Promise<void> {
    await (
      await this.dataSource
    ).set(loanApplicationId, JSON.stringify(loanApplication));
  }

  /**
   * delete - deletes loan by loan application id
   * @param loanApplicationId - loan application id
   * @returns Promise<void>
   */
  async delete(loanApplicationId: string): Promise<void> {
    await (await this.dataSource).del([loanApplicationId]);
  }
}
