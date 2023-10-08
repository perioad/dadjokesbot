import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { log } from '../utils/logger.util';
import { handleError } from '../utils/error-handler.util';
import {
  ExplainedJoke,
  Joke,
} from '../../lambdas/get-joke/models/joke.interface';

export { jokesDB };

class JokesDB {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly jokesTable = process.env.TABLE_JOKES as string;
  private readonly lastJokeTable = process.env.TABLE_LAST_JOKE as string;
  private readonly lastJokeKey = 'lastjoke';

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

  public async getLastJoke(): Promise<Joke | void> {
    try {
      log(this.getLastJoke.name);

      const getInput: GetCommandInput = {
        TableName: this.lastJokeTable,
        Key: {
          key: this.lastJokeKey,
        },
      };

      const { Item } = await this.docClient.send(new GetCommand(getInput));

      log('success getting last joke');

      return Item as Joke;
    } catch (error) {
      await handleError(this.getLastJoke.name, error);
    }
  }

  public async getJoke(id: string): Promise<ExplainedJoke | void> {
    try {
      log(this.getJoke.name);

      const getInput: GetCommandInput = {
        TableName: this.jokesTable,
        Key: {
          id,
        },
      };

      const { Item } = await this.docClient.send(new GetCommand(getInput));

      log('success getting joke');

      return Item as ExplainedJoke;
    } catch (error) {
      await handleError(this.getJoke.name, error);
    }
  }

  public async saveJoke(
    { id, joke }: Joke,
    explanation: string,
  ): Promise<void> {
    try {
      log(this.saveJoke.name, joke);

      const jokeItem: ExplainedJoke = {
        id: String(id),
        joke,
        explanation,
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
        key: this.lastJokeKey,
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
