import request from 'request';

export default class Request {
	constructor() {
		this.request = request;
	}

	getOrDelete(method, url, headers, callback) {
		this.request({
			uri: url,
			method,
			headers,
		}, (error, response, body) => {
			callback(error, response, body);
		});
	}

	postOrPut(method, url, formData, headers, callback) {
		this.request({
			uri: url,
			method,
			form: formData,
			headers,
		}, (error, response, body) => {
			callback(error, response, body);
		});
	}
}
