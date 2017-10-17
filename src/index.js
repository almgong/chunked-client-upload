import ChunkManager from './lib/chunk_manager';

/**
 * Service object for uploading arbitrary blobs to a specified endpoint.
 *
 * TODO: documentation on usage.
**/
class ChunkedClientUploader {
	constructor(options) {
		this._uploadIdEndpoint = options.uploadIdEndpoint;
		this._uploadEndpoint = options.uploadEndpoint;
	}

	upload(Blob) {
		
	}

	/** 
	 * validates arguments passed in constructor
	**/
	_validateInitialization() {
		if (!this._uploadIdEndpoint) {
			throw new Error('A valid endpoint to retrieve an upload identifier is required');
		} else if (!this._uploadEndpoint) {
			throw new Error('A valid endpoint to retrieve an upload identifier is required');
		}
	}
}

export default A;