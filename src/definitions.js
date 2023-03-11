import axios from 'axios';
import { CONSTANTS } from './constants.js';
import { saveWord } from './database.js';
import { makeBold, makeItalic, makeUnderline, sendMessage } from './telegram.js';
import { handleError, log } from './utils.js';

export const sendDefinition = async (chatId, word) => {
	try {
		await saveWord(chatId, word);

		log('getting defintion', chatId, word);

		const definitionRequest = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
		const definition = getDefinition(definitionRequest.data);

		log('success getting defintion');

		await sendMessage(chatId, definition);
	} catch (error) {
		await sendMessage(chatId, CONSTANTS.MESSAGES.NO_DEFINITIONS);

		handleError('sendDefinition', error);
	}
}

const getDefinition = data => {
	const [definitionInfo] = data;
	const meanings = definitionInfo.meanings.map(formatMeanings);

	return `${formatWord(definitionInfo.word)}\n${meanings.join('\n------------------------------------\n\n')}`;
}

const formatWord = word => `${makeUnderline(word)}\n`;

const formatMeanings = meaning => {
	return `${getPartOfSpeech(meaning.partOfSpeech)}

${getDefinitions(meaning.definitions)}
${getSynonyms(meaning.synonyms)}`;
}

const getPartOfSpeech = partOfSpeech => `${makeBold('part of speech:')} ${makeItalic(partOfSpeech)}`;

const getDefinitions = definitions => {
	return `${makeBold(definitions === 1 ? 'definition' : 'definitions:')}\n${concatDefinitions(definitions)}`;
}

const concatDefinitions = definitions => {
	return definitions.map(({ definition }) => makeItalic(`- ${definition}`)).join('\n');
}

const getSynonyms = synonyms => `${synonyms.length
		? '\n' + makeBold(synonyms.length === 1 ? 'synonym: ' : 'synonyms: ') + '<i>' + synonyms.join(', ') + '</i>' + '\n'
		: ''}`;