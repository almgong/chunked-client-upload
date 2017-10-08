const CONTENT_TYPE_HEADER_NAME = 'Content-Type';
const CONTENT_TYPE_JSON = 'application/json';

/**
 * Handles HTTP network requests. All supported request methods return a promise.
 * Currently supports only requests that return a JSON response.
**/
class Requester {
	/**
	 * Given an HTTP endpoint, sends a GET request with optional fetch options
	 * and returns a promise representing the request.
	 *
	 * @param endpoint the URL to send the request to
	 *
	 * @return a parsed response if the content type is supported, otherwise a Blob instance
	**/
	static get(endpoint, options) {
		options = options || {};

		Object.assign(options, { method: 'GET' });

		return this._fetch(endpoint, options);
	}

	static post(endpoint, payload, onProgress) {

	}

	/**
	 * Used internally to perform a generic fetch request. Great for cases where you
	 * don't care about progress and just need to send a request and get a response.
	 *
	 * @param endpoint the url endpoint to send the request
	 * @param options an optional hash that one would usually pass to fetch, including
	 * 				[body, cache, credentials, method, mode, ...]
	 *
	 * @return a Promise object that will be resolved with an appropriately parsed object. If
	 *					the Content-Type is not yet supported, the object resolved will default to an
	 *					instance of Blob.
	 *
	 * usage: this._fetch(endpoint [, options])
	**/
	static _fetch(endpoint, options) {
		const fetchOptions = {
			cache: 'default',
			method: 'GET',
			mode: 'cors', 
		};

		Object.assign(fetchOptions, options);

		return new Promise((resolve, reject) => {
			fetch(endpoint, fetchOptions).then((response) => {

				if (response.ok) {
					switch(response.headers.get(CONTENT_TYPE_HEADER_NAME)) {
						case CONTENT_TYPE_JSON:
							return response.json();
						default:
							return response.blob();	// let the user decide what to do otherwise
					}
				} else {
					reject({ error: response.error() });
				}
			}).then((parsedResponse) => {
				resolve(parsedResponse);
			});
		});
	}
}

export default Requester;