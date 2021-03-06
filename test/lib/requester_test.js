import assert from 'assert';
import simple from 'simple-mock';
import Requester from '../../src/lib/requester';

/**
 * Unit tests for lib/requester.js. NO arrow functions in test setup description
 * due to `this` binding issues.
**/

describe('Requester', function() {
	afterEach(function() {
    simple.restore();	// restores state of objects
  });

	describe('Requester.get', function() {
		it('should return a JSON object when requesting from a JSON endpoint', function() {
			let expectedResponse = { json: true }; 

			simple.mock(Requester, '_fetch').resolveWith(expectedResponse);

			Requester.get('/valid-json-endpoint.json').then((response) => {
				assert.deepEqual(expectedResponse, response);
			});
		});

		it('should return a Blob object when requesting from a non JSON endpoint', function() {
			// Blobs don't exist natively in node
			function Blob() {};
			let expectedResponse = new Blob(); 

			simple.mock(Requester, '_fetch').resolveWith(expectedResponse);

			Requester.get('/non-json-endpoint.fzxk').then((response) => {
				assert(response instanceof Blob);
			});
		});
	});

	describe('Requester.post', function() {
		it('should return a JSON object when POSTing to a JSON endpoint', function() {
			let expectedResponse = { json: true };

			simple.mock(Requester, '_fetch').resolveWith(expectedResponse);

			Requester.post('/valid-json-endpoint.json', { data: { 'hello': 'world' } }).then((response) => {
				assert.deepEqual(expectedResponse, response);
			});
		});

		it('should return a Blob object when POSTing to a non JSON endpoint', function() {
				function Blob() {};
				let expectedResponse = new Blob();

				simple.mock(Requester, '_fetch').resolveWith(expectedResponse);

				Requester.post('/non-json-endpoint.fzxk', { data: { 'hello': 'world' } }).then((response) => {
					assert.deepEqual(expectedResponse, response);
				});
			});
	});
});