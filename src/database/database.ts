import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { handleError } from '../utils/error-handler';
import { log } from '../utils/logger';
import { Child } from './models/child.interface';
import { User } from 'grammy/types';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export { db };

class DB {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly usersTable = process.env.TABLE_USERS as string;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.REGION });

    this.docClient = DynamoDBDocumentClient.from(client);
  }

  public async saveUser(user: User): Promise<void> {
    try {
      log(this.saveUser.name, user);

      const command = new PutCommand({
        TableName: this.usersTable,
        Item: {
          id: String(user.id),
          isActive: true,
          isPremium: user.is_premium || false,
          isBot: user.is_bot,
          startDate: new Date().toISOString(),
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          username: user.username || '',
          languageCode: user.language_code || '',
          stage: '0',
        },
      });

      await this.docClient.send(command);
    } catch (error: unknown) {
      handleError(this.saveUser.name, error);
    }
  }

  public async getUser(id: number): Promise<CoachUser | undefined> {
    try {
      log(this.getUser.name, id);

      const command = new GetCommand({
        TableName: this.usersTable,
        Key: {
          id: String(id),
        },
      });

      const { Item } = await this.docClient.send(command);

      log('user', Item);

      return Item as CoachUser;
    } catch (error: unknown) {
      handleError(this.getUser.name, error);
    }
  }

  public async deactivateUser(id: number): Promise<void> {
    try {
      log(this.deactivateUser.name, id);

      const command = new UpdateCommand({
        TableName: this.usersTable,
        Key: {
          id: String(id),
        },
        AttributeUpdates: {
          isActive: {
            Value: false,
          },
          endDate: {
            Value: new Date().toISOString(),
          },
        },
      });

      await this.docClient.send(command);
    } catch (error: unknown) {
      handleError(this.deactivateUser.name, error);
    }
  }

  public async reactivateUser(id: number): Promise<void> {
    try {
      log(this.reactivateUser.name, id);

      const command = new UpdateCommand({
        TableName: this.usersTable,
        Key: {
          id: String(id),
        },
        AttributeUpdates: {
          isActive: {
            Value: true,
          },
          reactivateDate: {
            Value: new Date().toISOString(),
          },
        },
      });

      await this.docClient.send(command);
    } catch (error: unknown) {
      handleError(this.reactivateUser.name, error);
    }
  }

  public async updateUserStage(id: number, stage: Stage): Promise<void> {
    try {
      log(this.updateUserStage.name, id, stage);

      const command = new UpdateCommand({
        TableName: this.usersTable,
        Key: {
          id: String(id),
        },
        AttributeUpdates: {
          stage: {
            Value: stage,
          },
        },
      });

      await this.docClient.send(command);
    } catch (error: unknown) {
      handleError(this.updateUserStage.name, error);
    }
  }

  public async getSession(
    id: number,
    stage: Stage,
  ): Promise<Session | undefined> {
    try {
      log(this.getSession.name, id);

      const command = new GetCommand({
        TableName: this.sessionsTable,
        Key: {
          id: String(id),
          stage,
        },
      });

      const { Item } = await this.docClient.send(command);

      log('session', Item);

      return Item as Session;
    } catch (error: unknown) {
      handleError(this.getSession.name, error);
    }
  }

  public async startSession(
    id: number,
    stage: Stage,
    messages: MessageAI[],
  ): Promise<void> {
    try {
      log(this.startSession.name, id);

      const commandZeroStage = new PutCommand({
        TableName: this.sessionsTable,
        Item: {
          id: String(id),
          stage,
          messages,
          isFinished: false,
        },
      });

      await this.docClient.send(commandZeroStage);

      const firstStageMessage: MessageAI = {
        content: `${prompts.personality}${prompts.stages[1]}`,
        role: ChatCompletionRequestMessageRoleEnum.User,
      };
      const commandFirstStage = new PutCommand({
        TableName: this.sessionsTable,
        Item: {
          id: String(id),
          stage: '1',
          messages: [firstStageMessage],
          isFinished: false,
        },
      });

      await this.docClient.send(commandFirstStage);
    } catch (error: unknown) {
      handleError(this.startSession.name, error);
    }
  }

  public async updateSession(
    id: number,
    stage: Stage,
    messages: MessageAI[],
    isFinished: boolean,
  ) {
    try {
      log(this.updateSession.name, id, isFinished);

      const command = new UpdateCommand({
        TableName: this.sessionsTable,
        Key: {
          id: String(id),
          stage,
        },
        UpdateExpression:
          'set messages = list_append(if_not_exists(messages, :empty_list), :newMessages)',
        ExpressionAttributeValues: {
          ':newMessages': messages,
          ':empty_list': [],
        },
      });

      await this.docClient.send(command);
    } catch (error: unknown) {
      handleError(this.updateSession.name, error);
    }
  }
}

const db = new DB();
