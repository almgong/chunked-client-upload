/**
 * Module that allows chunking of an arbitrary blob. Chunkers expose operation(s)
 * to iteratively return chunks (e.g. similar to a generator/iterator).
 */
export default class Chunker {
  /**
   * Constructs a Chunker instance
   * 
   * @param  { Blob }     blob    instance of Blob (or something that quacks like one)
   * @param  { Object }   options optional overrides that affect chunking operations
   * @return { Chunker }          a Chunker instance
   */
  constructor(blob, options) {
    if(!blob || typeof blob.slice != 'function' || typeof blob.size != 'number') {
      throw new Error('Chunker requires a Blob like object');
    } else if (options && !this._validateOptions(options)) {
      throw new Error('Invalid options');
    }

    let chunkOptions = {
      chunkSize: 1000000, // in bytes, defaults to 1MB
    };

    Object.assign(chunkOptions, options || {});

    this._blob = blob;
    this._options = chunkOptions;
    this._chunkOffset = 0;
  }

  /**
   * Returns the total number of chunks needed to completely split the specfied blob.
   * @return { Integer } integer number of chunks
   */
  numChunksNeeded() {
    return Math.ceil(this._blob.size / this._options.chunkSize);
  }

  /**
   * Returns the next chunk. Chunks are returned in the order they exist within the
   * blob. This should be the main operation utilized to eventually retrieve all blob chunks.
   * @return { Blob } a blob chunk of at most chunkSize bytes, or null if there are no more chunks
   */
  next() {
    return this.chunkAt(this._chunkOffset++);
  }

  /**
   * Returns a specific chunk based on its index. Similar to String methods such as
   * charAt(), if the chunk number is known, this method can be used to directly access
   * a specific chunk (rather than having to go through next() all over again).
   * @param  { Integer } index  the chunk number (zero based)
   * @return { Blob }           a blob chunk of at most chunkSize bytes, or null if there are no bytes at the index                  
   */
  chunkAt(index) {
    let nextChunkStart = index * this._options.chunkSize;
    let chunk = this._blob.slice(nextChunkStart, nextChunkStart + this._options.chunkSize);

    return (chunk.size > 0) ? chunk : null
  }

  /**
   * Internally used to validate  options passed into the constructor.
   * @param  { Object } options   options passed into the constructor
   * @return { Boolean }          whether the options are valid
   */
  _validateOptions(options) {
    let isNotDefined = (obj) => {
      return obj === undefined;
    };

    if (isNotDefined(options.chunkSize) || typeof options.chunkSize == "number" && options.chunkSize > 0) {
      return true;
    }

    return false;
  }
}