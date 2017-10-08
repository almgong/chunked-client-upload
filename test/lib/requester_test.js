import 'babel-polyfill';	// for those delicious Promises and the like

import assert from 'assert';
import simple from 'simple-mock';
import Requester from '../../src/lib/requester';

/**
 * Unit tests for lib/requester.js. NO arrow functions in test setup description
 * due to `this` binding issues.
**/

describe('Requester', function() {
	describe('Requester.get', function() {
		it('should return a JSON object when requesting from a JSON endpoint', function() {
			let expectedResponse = { json: true }; 

			simple.mock(Requester, '_fetch').resolveWith(expectedResponse);

			Requester.get('/valid-json-endpoint.json').then((response) => {
				assert.deepEqual(expectedResponse, response);
			});
		});
	});
});