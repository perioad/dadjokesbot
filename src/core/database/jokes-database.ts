import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { log } from '../utils/logger.util';
import { handleError } from '../utils/error-handler.util';
import { Joke } from '../../lambdas/get-joke/models/joke.interface';

export { jokesDB };

class JokesDB {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly jokesTable = process.env.TABLE_JOKES as string;
  private readonly lastJokeTable = process.env.TABLE_LAST_JOKE as string;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.REGION });

    this.docClient = DynamoDBDocumentClient.from(client);
  }

  public async getAllJokesIds(): Promise<string[] | void> {
    try {
      log(this.getAllJokesIds.name);

      const scanInput: ScanCommandInput = {
        TableName: this.jokesTable,
        ProjectionExpression: 'id',
      };

      const { Items = [] } = await this.docClient.send(
        new ScanCommand(scanInput),
      );

      log('success getting all jokes ids');

      return Items.map(({ id }) => id);
    } catch (error) {
      await handleError(this.getAllJokesIds.name, error);
    }
  }

  public async saveJoke({ id, joke }: Joke): Promise<void> {
    try {
      log(this.saveJoke.name, joke);

      const jokeItem: Joke = {
        id: String(id),
        joke,
      };

      const command = new PutCommand({
        TableName: this.jokesTable,
        Item: jokeItem,
      });

      await this.docClient.send(command);
    } catch (error) {
      await handleError(this.saveJoke.name, error);
    }
  }

  public async saveLastJoke({ id, joke }: Joke): Promise<void> {
    try {
      log(this.saveLastJoke.name, joke);

      const jokeItem = {
        key: 'lastjoke',
        id,
        joke,
      };

      const command = new PutCommand({
        TableName: this.lastJokeTable,
        Item: jokeItem,
      });

      await this.docClient.send(command);
    } catch (error) {
      await handleError(this.saveLastJoke.name, error);
    }
  }
}

const jokesDB = new JokesDB();
