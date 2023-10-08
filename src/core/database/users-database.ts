import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { MyUser, MyUserSchedule } from './models/kid.interface';
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

  public async saveUser(user: User): Promise<void> {
    try {
      log(this.saveUser.name, user);

      const userItem: MyUser = {
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
        scheduleHours: 11,
      };

      const command = new PutCommand({
        TableName: this.usersTable,
        Item: userItem,
      });

      await this.docClient.send(command);
    } catch (error) {
      await handleError(this.saveUser.name, error);
    }
  }

  public async getUser(id: number): Promise<MyUser | undefined> {
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

      return Item as MyUser;
    } catch (error) {
      await handleError(this.getUser.name, error);
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
    } catch (error) {
      await handleError(this.deactivateUser.name, error);
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
          reactDate: {
            Value: new Date().toISOString(),
          },
        },
      });

      await this.docClient.send(command);
    } catch (error) {
      await handleError(this.reactivateUser.name, error);
    }
  }

  public async getAllActiveUsersCurrentHours(): Promise<
    MyUserSchedule[] | void
  > {
    try {
      log(this.getAllActiveUsersCurrentHours.name);

      const currentHours = new Date().getUTCHours();

      const scanInput: ScanCommandInput = {
        TableName: this.usersTable,
        FilterExpression:
          'isActive = :isActiveValue AND scheduleHours = :currentHours',
        ProjectionExpression: 'id, scheduleHours',
        ExpressionAttributeValues: {
          ':isActiveValue': true,
          ':currentHours': currentHours,
        },
      };

      const { Items = [] } = await this.docClient.send(
        new ScanCommand(scanInput),
      );

      log('success getting all active users ids');

      return Items.map(({ id }) => id);
    } catch (error) {
      return await handleError(this.getAllActiveUsersCurrentHours.name, error);
    }
  }
}

const usersDB = new UsersDB();
