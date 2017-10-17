import assert from 'assert';
import simple from 'simple-mock';
import Requester from '../../src/lib/requester';
import UploadWorker from '../../src/lib/upload_worker';

/**
 * Unit tests for lib/requester.js. NO arrow functions in test setup description
 * due to `this` binding issues.
**/

describe('UploadWorker', function() {
	afterEach(function() {
    simple.restore();	// restores state of objects
  });

	describe('#perform', function() {
		it('should invoke onSuccess callback if request succeeds', function() {
			simple.mock(Requester, 'post').resolveWith({ status: "ok" });

			// sub-ideal solution, but asserting in a callback will trigger a
			// warning in the test framework about unhandled promise rejection (due
			// to a failed assertion)
			// So, no warning == pass
			let onSuccess = (identifier) => {
				assert.equal(identifier, 0);
				assert(true, 'onSuccess was never called!');
			};
			let worker = new UploadWorker(null);

			worker.perform(0, "data blob", '/endpoint', "token", onSuccess, null);
		});

		it('should invoke onFailure callback if request fails', function() {
			simple.mock(Requester, 'post').rejectWith({ message: "Server is down" });

			// sub-ideal solution, but asserting in a callback will trigger a
			// warning in the test framework about unhandled promise rejection (due
			// to a failed assertion)
			// So, no warning == pass
			let onFailure = (identifier, err) => {
				assert.equal(identifier, 15);
				assert.equal(err.message, "Server is down");
				assert(true, 'onFailure was never called!');
			};
			let worker = new UploadWorker("token", null);

			worker.perform(15, "data blob", '/endpoint', "token", null, onFailure);
		});
	});
});