import Chunker from './chunker';
import UploadWorker from './upload_worker';

const CHECKSUM_ALG_MD5 = "md5";
const ENCRYPTION_ALG_RSA = "rsa";

export { CHECKSUM_ALG_MD5, ENCRYPTION_ALG_RSA };

/**
 * Manages workers to upload an arbitrary blob in parallel.
 */
export default class UploadManager {
  /**
   * Constructs an UploadManager
   * @param  { Object }   options optional  options to tune the behavior of the upload manager
   * @return { UploadManager }              an instance of UploadManager
   */
  constructor(options) {
    options = options || {};

    if (!options.endpoint || !options.token) {
      throw new Error('Must specify an endpoint and/or upload token');
    }

    // possible options and their defaults
    let defaultOptions = {
      // optional checksum
      checksum: false,
      checksumIncremental: false,           // whether to generate a checksum for each chunk
      checksumAlgorithm: CHECKSUM_ALG_MD5,

      // optional encryption
      encrypt: false,
      encryptionAlgorithm: ENCRYPTION_ALG_RSA,
      encryptionPublicKey: null,

      // worker options
      maxConcurrentConnections: 3,  // maximum number of active workers at any time
      maxRetriesPerConnection: 3,   // maximum number of retry attempts on request failure per worker

      // required options!
      endpoint: null,   // URL to POST
      token: null,      // token to identify the upload (i.e. retrieved from server)
    };

    Object.assign(defaultOptions, options || {});

    // defaultOptions has now been overrided with user-specified options
    this._options = defaultOptions;

    // sets a clean upload state
    this._reset();
  }

  /**
   * Uploads a Blob
   * @param { Blob } blob           the Blob to upload
   * @param  { Function } onSuccess callback invoked on successful upload
   * @param  { Function } onError   callback invoked on unsuccessful upload, with an error message
   */
  upload(blob, onSuccess, onError) {
    if (!blob) {
      throw new Error('Must specify a valid Blob like object');
    } else if (this._uploadState.inProgress) {
      throw new Error('UploadManager is currently uploading. Please wait until the current operation completes or use a different manager');
    }

    // set state flag
    this._uploadState.inProgress = true;
    
    // callbacks
    this._onSuccess = onSuccess;
    this._onError = onError;

    let chunker = new Chunker(blob, { chunkSize: 500 });  // chunkSize is passed in for testing purposes
    
    // begin uploading "loop"    
    this._assignWorkers();
  }

  /**
   * Assigns workers to chunks in batch, up to at most the value of maxConcurrentConnections
   */
  _assignWorkers() {
    // contains at most the specified number of workers
    let workersToAssign = this._uploadState.idleWorkers.slice(0, this._options.maxConcurrentConnections);

    // assign work to all workers
    workersToAssign.forEach((worker) => {
      let nextChunk = chunker.next();

      if (nextChunk) {
        this._assignWorkerToChunk(
          idleWorkersCount[i], 
          nextChunk, 
          this._uploadState.nextChunkNumber++
        );
      }
    });
  }

  /**
   * Assigns a specific chunk to a worker. Assumes that the worker is not already uploading.
   * @param  { UploadWorker } worker      Idle UploadWorker instance
   * @param  { Blob }         chunk       Blob chunk to upload
   * @param  { Integer }      chunkNumber the chunk number associated with the chunk
   */
  _assignWorkerToChunk(worker, chunk, chunkNumber) {
    worker.perform(
      chunkNumber, 
      chunk, 
      this._options.endpoint, 
      this._options.token, 
      this._onWorkerSuccess, 
      this._onWorkerFailure
    );

    this._uploadState.workerAssignments[chunkNumber] = worker;
  }

  /**
   * Creates UploadWorker instances
   * @param  { Integer } numWorkers the number of workers to create
   * @return { Array }              an array of the workers created
   */
  _generateMaxIdleWorkers(numWorkers) {
    let workers = [];

    for (let i = 0; i < this._options.maxConcurrentConnections; i++) {
      workers.push(new UploadWorker({
          maxAttempts: this._options.maxRetriesPerConnection 
        })
      );
    }

    return workers;
  }

  _onWorkerSuccess(chunkNumber) {
    console.log("Successfully uploaded chunk: " + chunkNumber);

    // move worker from active to idle pool
    let currentWorker = this._uploadState.workerAssignments[chunkNumber];

    delete this._uploadState.workerAssignments[chunkNumber];
    this._uploadState.idleWorkers.push(currentWorker);

    // logic to proceed, either assign more work or notify caller that work is complete
    this._uploadState.numChunksUploaded++;
    if (this._uploadState.numChunksUploaded < this._uploadState.expectedNumChunksToUpload) {
      // optimistically assign as many idle workers as there are chunks
      this._assignWorkers();
    } else {
      // we are done!
      this._onSuccess();
      this._reset();
    }
  }

  _onWorkerFailure(chunkNumber, err) {
    // TODO: exponential backoff/resumability
    this._onError({ message: `There was an issue uploading chunk ${chunkNumber}. Error: ${err.message}` });
  }

  /**
   * Sets a clean upload state, so that the chunk manager is ready for the next upload
   */
  _reset() {
    this._uploadState = {
      // exponential backoff, coming soon!
      inBackoff: false,
      backoffFactor: 0,

      // available pool of workers that are ready to perform, or are performing
      idleWorkers: this._generateMaxIdleWorkers(),
      workerAssignments: {},  // { chunkNumber: UploadWorker, ... }

      // the state of this UploadManager
      inProgress: false,

      // chunk state
      nextChunkNumber: 0,             // the next chunk number to assign (!= the number uploaded as there could be uploads in flight)
      numChunksUploaded: 0,
      expectedNumChunksToUpload: 0,   // the total number of chunks that should be uploaded, set in perform()
    };
  }
}