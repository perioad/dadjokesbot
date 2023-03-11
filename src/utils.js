export const handleError = (place, error) => {
	if (!error) {
		console.error(`ERROR in ${place}: `, '???');
	} else {
		console.error(`ERROR in ${place}: `, {
			status: error.status,
			code: error.code,
			message: error.message,
			data: error.config && error.config.data,
			response: error.response && error.response.data
		});
	}
}

export const log = (text, ...args) => {
	console.info(`${text.toUpperCase()}${args.length ? ': ' : ''}`, ...args);
}

export const delay = async ms => {
	log('delaying ms', ms);

	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}