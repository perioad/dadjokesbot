import { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { handleError, log } from './utils.js';

export const getItem = async (key) => {
	try {
		log('getting item from db', key);

		const client = new DynamoDBClient({ region: process.env.REGION });

		const gettingParams = {
			TableName: 'dadjokes',
			Key: {
				id: { S: String(key) }
			}
		};

		const { Item } = await client.send(new GetItemCommand(gettingParams));

		if (Item) {
			const unmarshalled = unmarshall(Item);

			log('item found', unmarshalled);

			return unmarshalled;
		} else {
			log('item not found');

			return null;
		}
	} catch (error) {
		handleError('getItem', error);
	}
}

export const addUser = async (chat) => {
	try {
		log('checking if user exist', chat);

		const user = await getItem(chat.id);

		if (user) {
			log('known user');

			await changeUserActivityStatus(chat.id, true);

			return;
		}

		log('adding user', chat);

		const client = new DynamoDBClient({ region: process.env.REGION });

		const creationParams = {
			TableName: 'dadjokes',
			Item: {
				id: { S: String(chat.id) },
				first_name: { S: chat.first_name || '' },
				last_name: { S: chat.last_name || '' },
				username: { S: chat.username || '' },
				language_code: { S: chat.language_code || '' },
				isActive: { BOOL: true },
				words: { L: [] }
			}
		};

		await client.send(new PutItemCommand(creationParams));

		log('user is added');
	} catch (error) {
		handleError('addUser', error);
	}
}

export const changeUserActivityStatus = async (chatId, status) => {
	try {
		const messageStatus = status ? 'activat' : 'deactivat';

		log(`${messageStatus}ing user`, chatId);

		const client = new DynamoDBClient({ region: process.env.REGION });
		const updationParams = {
			TableName: 'dadjokes',
			Key: {
				id: { S: String(chatId) }
			},
			UpdateExpression: 'set isActive = :isActive',
			ExpressionAttributeValues: {
				':isActive': { BOOL: status }
			}
		};

		await client.send(new UpdateItemCommand(updationParams));

		log(`user is ${messageStatus}ed`);
	} catch (error) {
		handleError('changeUserActivityStatus', error);
	}
}

export const saveWord = async (chatId, word) => {
	try {
		log('saving word', word);

		const client = new DynamoDBClient({ region: process.env.REGION });
		const updationParams = {
			TableName: 'dadjokes',
			Key: {
				id: { S: String(chatId) }
			},
			UpdateExpression: 'set words = list_append(words, :newItem)',
			ExpressionAttributeValues: {
				':newItem': { L: [{ S: word }] },
			}
		};

		await client.send(new UpdateItemCommand(updationParams));

		log('success saving word');
	} catch (error) {
		handleError('saveWord', error);
	}
}

export const saveJoke = async (jokeId) => {
	try {
		log('saving joke', jokeId);

		const client = new DynamoDBClient({ region: process.env.REGION });
		const updationParams = {
			TableName: 'dadjokes',
			Key: {
				id: { S: 'jokes' }
			},
			UpdateExpression: 'ADD jokeslist :newItem',
			ExpressionAttributeValues: {
				':newItem': { SS: [jokeId] }
			}
		};

		await client.send(new UpdateItemCommand(updationParams));

		log('success saving joke');
	} catch (error) {
		handleError('saveJoke', error);
	}
}

export const getAllActiveUsers = async () => {
	try {
		log('getting all active users');

		const client = new DynamoDBClient({ region: process.env.REGION });
		const scanParams = {
			TableName: 'dadjokes',
			FilterExpression: 'isActive = :attrValue',
			ExpressionAttributeValues: {
				':attrValue': { BOOL: true }
			},
			ProjectionExpression: 'id'
		};

		const { Items = [] } = await client.send(new ScanCommand(scanParams));
		const unmarshalled = Items.map(item => unmarshall(item));

		log('success getting all active users', unmarshalled);

		return unmarshalled;
	} catch (error) {
		handleError('getAllActiveUsers', error);
	}
}

