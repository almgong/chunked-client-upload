import assert from 'assert';
import simple from 'simple-mock';
import Chunker from '../../src/lib/chunker';

/**
 * Unit tests for lib/requester.js. NO arrow functions in test setup description
 * due to `this` binding issues.
**/

describe('Chunker', function() {
	afterEach(function() {
    simple.restore();	// restores state of objects
  });

	describe('#constructor', function() {
		it('should be able to construct a default Chunker without options', function() {
			// hooray for ducktyping
			let blob = simple.stub();
			simple.mock(blob, 'size', 1);
			simple.mock(blob, 'slice').returnWith(null);

			new Chunker(blob);
		});

		it('should be able to construct a Chunker with options', function() {
			let blob = simple.stub();
			simple.mock(blob, 'size', 1);
			simple.mock(blob, 'slice').returnWith(null);

			new Chunker(blob, {});

			new Chunker(blob, { optionWeDontCareAbout: 1 });
			new Chunker(blob, { chunkSize: 1 });
		});

		it('throws Error if constructing a Chunker without blob', function() {
			assert.throws(
				() => {
					new Chunker();
				},
				/Chunker requires a Blob like object/
			);
		});

		it('throws Error if constructing a Chunker with invalid chunkSize option', function() {
			let blob = simple.stub();
			simple.mock(blob, 'size', 1);
			simple.mock(blob, 'slice').returnWith(null);

			assert.throws(
				() => {
					new Chunker(blob, { chunkSize: -1 });
				},
				/Invalid options/
			);

			assert.throws(
				() => {
					new Chunker(blob, { chunkSize: 0 });
				},
				/Invalid options/
			);

			assert.throws(
				() => {
					new Chunker(blob, { chunkSize: null });
				},
				/Invalid options/
			);
		});
	});

	describe('#numChunksNeeded', function() {
		it('should return the correct number of chunks needed to completely chunk the blob, default chunkSize', function() {
			let blob = simple.stub();
			simple.mock(blob, 'size', 10000000);
			simple.mock(blob, 'slice').returnWith(null);

			assert.equal(new Chunker(blob).numChunksNeeded(), 10);
		});

		it('should return the correct number of chunks needed to completely chunk the blob, specified chunkSize', function() {
			let blob = simple.stub();
			simple.mock(blob, 'size', 27);
			simple.mock(blob, 'slice').returnWith(null);

			assert.equal(new Chunker(blob, { chunkSize: 5 }).numChunksNeeded(), 6);
		});
	});

	describe('#next', function() {
		it('should return all chunks by iteratively calling next', function() {
			let blobData = "abcdefg";
			let blob = simple.stub();
			simple.mock(blob, 'size', blobData.length);
			simple.mock(blob, 'slice').callFn((start, end) => { 
				let chunkedBlob = simple.stub();
				let chunkedData = blobData.slice(start, end);

				simple.mock(chunkedBlob, 'size', chunkedData.length);
				simple.mock(chunkedBlob, 'data').returnWith(chunkedData);	// not a real Blob method, for testing only

				return chunkedBlob;
			});

			let expectedIterations = 4;
			let expectedBlobDataInSequence = ['ab', 'cd', 'ef', 'g'];

			let chunker = new Chunker(blob, { chunkSize: 2 });
			let chunk;
			let iterations = 0;

			while(chunk = chunker.next()) {
				assert.equal(chunk.data(), expectedBlobDataInSequence[iterations++]);
			}

			assert.equal(iterations, expectedIterations);
		});
	});

	describe('#chunkAt', function() {
		it('should return randomly accessed chunks at a certain index', function() {
			let blobData = "abcdefg";
			let blob = simple.stub();
			simple.mock(blob, 'size', blobData.length);
			simple.mock(blob, 'slice').callFn((start, end) => { 
				let chunkedBlob = simple.stub();
				let chunkedData = blobData.slice(start, end);

				simple.mock(chunkedBlob, 'size', chunkedData.length);
				simple.mock(chunkedBlob, 'data').returnWith(chunkedData);	// not a real Blob method, for testing only

				return chunkedBlob;
			});

			let expectedIterations = 4;
			let expectedBlobDataInChunkSequence = ['ab', 'cd', 'ef', 'g'];
			let chunker = new Chunker(blob, { chunkSize: 2 });
			let unorderedAccessSequence = [2, 0, 1, 3];

			for (let index of unorderedAccessSequence) {
				let chunk = chunker.chunkAt(index);
				assert.equal(chunk.data(), expectedBlobDataInChunkSequence[index]);
			}
		});

		it('should return null if chunk number is out of range', function() {
			let blobData = "abcdefg";
			let blob = simple.stub();
			simple.mock(blob, 'size', blobData.length);
			simple.mock(blob, 'slice').callFn((start, end) => { 
				let chunkedBlob = simple.stub();
				let chunkedData = blobData.slice(start, end);

				simple.mock(chunkedBlob, 'size', chunkedData.length);
				simple.mock(chunkedBlob, 'data').returnWith(chunkedData);	// not a real Blob method, for testing only

				return chunkedBlob;
			});

			let chunker = new Chunker(blob, { chunkSize: 2 });
			
			assert.equal(chunker.chunkAt(-1), null);
			assert.equal(chunker.chunkAt(5), null);
		});
	});
});