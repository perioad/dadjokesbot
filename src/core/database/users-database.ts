import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Kid } from './models/kid.interface';
import { User } from 'grammy/types';
import { log } from '../utils/logger.util';
import { handleError } from '../utils/error-handler.util';

export { usersDB };

class UsersDB {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly usersTable = process.env.TABLE_USERS as string;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.REGION });

    this.docClient = DynamoDBDocumentClient.from(client);
  }

  public async saveKid(user: User): Promise<void> {
    try {
      log(this.saveKid.name, user);

      const userItem: Kid = {
        id: String(user.id),
        explanationsCount: 0,
        feedbacks: [],
        isActive: true,
        isBot: user.is_bot,
        isPremium: user.is_premium || false,
        languageCode: user.language_code || '',
        startDate: new Date().toISOString(),
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        username: user.username || '',
      };

      const command = new PutCommand({
        TableName: this.usersTable,
        Item: userItem,
      });

      await this.docClient.send(command);
    } catch (error) {
      await handleError(this.saveKid.name, error);
    }
  }

  public async getKid(id: number): Promise<Kid | undefined> {
    try {
      log(this.getKid.name, id);

      const command = new GetCommand({
        TableName: this.usersTable,
        Key: {
          id: String(id),
        },
      });

      const { Item } = await this.docClient.send(command);

      log('user', Item);

      return Item as Kid;
    } catch (error) {
      await handleError(this.getKid.name, error);
    }
  }

  public async deactivateKid(id: number): Promise<void> {
    try {
      log(this.deactivateKid.name, id);

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
    } catch (error) {
      await handleError(this.deactivateKid.name, error);
    }
  }

  public async reactivateKid(id: number): Promise<void> {
    try {
      log(this.reactivateKid.name, id);

      const command = new UpdateCommand({
        TableName: this.usersTable,
        Key: {
          id: String(id),
        },
        AttributeUpdates: {
          isActive: {
            Value: true,
          },
          reactDate: {
            Value: new Date().toISOString(),
          },
        },
      });

      await this.docClient.send(command);
    } catch (error) {
      await handleError(this.reactivateKid.name, error);
    }
  }

  public async getAllActiveUsersIds(): Promise<string[] | void> {
    try {
      log(this.getAllActiveUsersIds.name);

      const scanInput: ScanCommandInput = {
        TableName: this.usersTable,
        FilterExpression: 'isActive = :isActiveValue',
        ProjectionExpression: 'id',
        ExpressionAttributeValues: {
          ':isActiveValue': true,
        },
      };

      const { Items = [] } = await this.docClient.send(
        new ScanCommand(scanInput),
      );

      log('success getting all active users ids');

      return Items.map(({ id }) => id);
    } catch (error) {
      return await handleError(this.getAllActiveUsersIds.name, error);
    }
  }
}

const usersDB = new UsersDB();
