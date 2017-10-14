import Requester from './requester';

/**
 * Uploads a Blob to a specified route via HTTP POST.
 */
class UploadWorker {
	/**
	 * Constructs a new worker instance 
	 * @param  { * } identifier 				some identifier for the worker to label the data it is uploading - can be anything (like a chunk number)
	 * @param  { Blob } data        		the data to upload
	 * @param  { String } endpoint    	the endpoint to POST to
	 * @param  { Function } onSuccess 	callback invoked when work is complete
	 * @param  { Function } onFailure 	callback invoked when the worker failed to complete work maxAttempts times
	 * @param  { Object } options 			optional options
	 * @return { UploadWorker Object }  an instance of UploadWorker
	 */
	constructor(identifier, data, endpoint, onSuccess, onFailure, options) {
		this._identifier = identifier;
		this._data = data;
		this._endpoint = endpoint;
		this._onSuccess = onSuccess;
		this._onFailure = onFailure;
		this._maxAttempts = options.maxAttempts || 3;
		this._retryState = {
			attempts: 0
		};
	}

	/**
	 * POSTs data to the endpoint specified on initialization. The request body will
	 * be JSON in the form: { uploadIdentifier: <identifier>, data: <Blob> }. The onSuccess
	 * and onFailure callbacks passed in the constructor will be invoked when the upload
	 * completes successfully or the worker has reached the max failed attempts, respectively.
	 */
	perform() {
		Requester.post(this._endpoint, {}).then((response) => {
			// TODO: what more needs to be done?
			this._onSuccess();
		}).catch((err) => {
			if(++this._retryState.attempts < this._maxAttempts) {
				perform();
			} else {
				// reached maximum number of attempts, notify caller
				this._onFailure(err);
			}
		});
	}

	/**
	 * Retrieves the identifier for the data that the worker is attempting to upload
	 * @return { * } the identifier specified on worker initialization
	 */
	getIdentifier() {
		return this._identifier;
	}
}