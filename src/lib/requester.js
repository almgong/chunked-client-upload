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
	 * @param  { String } endpoint  the URL to send the request to
	 * @param  { Object } options  	optional fetch options
	 * @return { Promise }          a Promise object representing the request
	 */
	static get(endpoint, options) {
		options = options || {};

		Object.assign(options, { method: 'GET' });

		return this._fetch(endpoint, options);
	}

	/**
	 * Given an HTTP endpoint, sends a POST request with optional fetch options
	 * and returns a promise representing the request.
	 *
	 * @param  { String } endpoint	the URL to send the request to
	 * @param  { Object } options  	optional fetch options (i.e. { body: [post data], ... })
	 * @return { Promise }					a Promise object representing the request
	 */
	static post(endpoint, options) {
		options = options || {};

		Object.assign(options, { method: 'POST' });

		return this._fetch(endpoint, options);
	}

	/**
	 * Used internally to perform a generic fetch request. Great for cases where you
	 * don't care about progress and just need to send a request and get a response.
	 *
	 * @param  {String} endpoint 				the url endpoint to send the request
	 * @param  {Object} options  				an optional hash that one would usually pass to fetch, including
	 *                               		[body, cache, credentials, method, mode, ...]
	 * @return {Promise | error Object}	Promise object that will be resolved with an appropriately parsed object. If
	 *					                        the Content-Type is not yet supported, the object resolved will default to an
	 *					                        instance of Blob. If an error occurred, an object will be returned with a message.
	 */
	static _fetch(endpoint, options) {
		// defaults
		const fetchOptions = {
			cache: 'default',
			method: 'GET',
			mode: 'cors', 
		};

		Object.assign(fetchOptions, options);

		return new Promise((resolve, reject) => {
			fetch(endpoint, fetchOptions).then((response) => {
				if (response.ok) {
					let contentType = response.headers.get(CONTENT_TYPE_HEADER_NAME).toLowerCase();

					switch(true) {
						case contentType.includes(CONTENT_TYPE_JSON):
							return response.json();
						default:
							return response.blob();	// let the user decide what to do otherwise with the blob
					}
				} else {
					reject({ error: { message: 'The request was not accepted.' } });
				}
			}).then((parsedResponse) => {
				resolve(parsedResponse);
			}).catch((err) => {	// if an error is catched, a network related error may have occurred
				// according to https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Checking_that_the_fetch_was_successful
				// fetch() returns a TypeError
				reject({ error: { message: err.message} });
			});
		});
	}
}

export default Requester;