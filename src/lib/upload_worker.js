import Requester from './requester';

/**
 * Uploads a Blob to a specified route via HTTP POST.
 */
export default class UploadWorker {
  /**
   * Constructs a new worker instance 
   * @param  { Object } options       optional options
   * @return { UploadWorker }         an instance of UploadWorker
   */
  constructor(options) {
    options = options || {};

    this._maxAttempts = options.maxAttempts || 3;
    this._retryState = {
      attempts: 0
    };
  }

  /**
   * POSTs data to the endpoint specified. The onSuccess and onFailure callbacks will be invoked when the upload
   * completes successfully or the worker has reached the max failed attempts, respectively.
   * @param  { * } identifier           some identifier for the worker to label the data it is uploading - can be anything (like a chunk number)
   * @param  { Blob } data              the data to upload
   * @param  { String } endpoint        the endpoint to POST to
   * @param  { String | Integer } token the upload token included in the request body
   * @param  { Function } onSuccess     callback invoked when work is complete, invoked with the identifier
   * @param  { Function } onFailure     callback invoked when the worker failed to complete work maxAttempts times, invoked with the identifier and error
   */
  perform(identifier, data, endpoint, token, onSuccess, onFailure) {
    Requester.post(endpoint, {
      body: { 
        chunkNumber: identifier,
        data: data,
        token: token
      }
    }).then((responseData) => {
      onSuccess(identifier);
      this._reset();
    }).catch((err) => {
      if(++this._retryState.attempts < this._maxAttempts) {
        // retry
        this.perform(identifier, data, endpoint, token, onSuccess, onFailure);
      } else {
        // reached maximum number of attempts, notify caller
        onFailure(identifier, err);
      }
    });
  }

  /**
   * Resets state of the worker. Should be called when the worker successfully completes
   * a current task, or if there is an arbitrary need to reset the state.
   */
  _reset() {
    this._retryState = {
      attempts: 0
    };
  }
}