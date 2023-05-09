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

export const getAllItemsFromTable = async (tableName, key) => {
	try {
		log('getting all items from table: ', tableName, key);

		const client = new DynamoDBClient({ region: process.env.REGION });
		const gettingParams = {
			TableName: tableName
		};

		if (key) {
			gettingParams.ProjectionExpression = key;
		}

		const { Items } = await client.send(new ScanCommand(gettingParams));

		if (!Items || Items.length <= 0) {
			log('items not found');

			throw new Error(`No items found in table: ${tableName} by key: ${key}`);
		} else {
			const items = Items.map(item => unmarshall(item));

			if (key) {
				return items.map(item => item[key]);
			}

			return items;
		}
	} catch (error) {
		handleError('getAllItemsFromTable', error);
	}
}

export const addUser = async (chat) => {
	try {
		log('checking if user exist', chat);

		const user = await getItem(chat.id);

		if (user) {
			if (user.isActive) {
				log('known active user');

				return user;
			} else {
				log('known deactive user');

				await changeUserActivityStatus(chat.id, true);

				return;
			}
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
				isBot: { BOOL: chat.is_bot ?? false },
				words: { L: [] },
				startDate: { S: new Date().toISOString() }
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
			UpdateExpression:
				'SET isActive = :isActive, ' +
				`${status ? 'reactDate = :reactDate' : 'endDate = :endDate'}`,
			ExpressionAttributeValues: {
				':isActive': { BOOL: status },
				...status
					? { ':reactDate': { S: new Date().toISOString() } }
					: { ':endDate': { S: new Date().toISOString() } }
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
			UpdateExpression: 'SET words = list_append(words, :newItem)',
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

export const saveJoke = async (jokeId, joke) => {
	try {
		log('saving joke', jokeId);

		const dateInMinutes = Date.now() / 1000 / 60;
		const dateInMinutesRound = Math.floor(dateInMinutes);
		const dateInMs = dateInMinutesRound * 60 * 1000;
		const client = new DynamoDBClient({ region: process.env.REGION });
		const creationParams = {
			TableName: 'dadjokeslist',
			Item: {
				id: { S: jokeId },
				joke_text: { S: joke },
				creation_date: { N: dateInMs.toString() },
			}
		};

		await client.send(new PutItemCommand(creationParams));

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

export const getTheLastJoke = async () => {
	try {
		log('getting the last joke');

		const msInDay = 86400000;
		const msNow = Date.now();
		const oneDayFromNowInMs = msNow - msInDay;

		const client = new DynamoDBClient({ region: process.env.REGION });
		const scanParams = {
			TableName: 'dadjokeslist',
			FilterExpression: 'creation_date > :oneDayFromNowInMs',
			ExpressionAttributeValues: {
				':oneDayFromNowInMs': { N: oneDayFromNowInMs.toString() }
			},
			ProjectionExpression: 'id, joke_text, joke_explanation'
		};

		const { Items = [] } = await client.send(new ScanCommand(scanParams));

		const lastJoke = Items.map(item => unmarshall(item))[0];

		log(`got the last joke`, lastJoke);

		return lastJoke;
	} catch (error) {
		handleError('getTheLastJoke', error);
	}
}

export const saveExplanation = async (jokeId, explanation) => {
	try {
		log('saving explanation');

		const client = new DynamoDBClient({ region: process.env.REGION });
		const updationParams = {
			TableName: 'dadjokeslist',
			Key: {
				id: { S: jokeId }
			},
			UpdateExpression: 'SET joke_explanation = :joke_explanation',
			ExpressionAttributeValues: {
				':joke_explanation': { S: explanation }
			}
		};

		await client.send(new UpdateItemCommand(updationParams));

		log(`explanation is saved`);
	} catch (error) {
		handleError('saveExplanation', error);
	}
}


export const saveExplanationRequest = async (chatId, jokeId) => {
	try {
		log('saving explanation request');

		const client = new DynamoDBClient({ region: process.env.REGION });
		const updationParams = {
			TableName: 'dadjokes',
			Key: {
				id: { S: String(chatId) }
			},
			UpdateExpression: 'SET explanation_requests = list_append(if_not_exists(explanation_requests, :emptyList), :newItem) ADD explanations_count :explanationsCount',
			ExpressionAttributeValues: {
				':newItem': {
					L: [{
						M: {
							request_date: { S: new Date().toISOString() },
							jokeId: { S: String(jokeId) }
						}
					}]
				},
				':emptyList': { L: [] },
				':explanationsCount': { N: '1' },
			}
		};

		await client.send(new UpdateItemCommand(updationParams));

		log('success saving explanation request');
	} catch (error) {
		handleError('saveExplanationRequest', error);
	}
}