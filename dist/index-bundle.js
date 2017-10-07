'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chunker = require('lib/chunker');

var _chunker2 = _interopRequireDefault(_chunker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Service object for uploading arbitrary blobs to a series of defined endpoints.
 *
 * TODO: documentation on usage.
**/
var ChunkedClientUploader = function () {
	function ChunkedClientUploader(uploadIdEndpoint, uploadEndpoint) {
		_classCallCheck(this, ChunkedClientUploader);

		this._uploadIdEndpoint = uploadIdEndpoint;
		this._uploadEndpoint = uploadEndpoint;

		(0, _chunker2.default)();
	}

	_createClass(ChunkedClientUploader, [{
		key: 'hi',
		value: function hi() {
			alert('hi');
		}

		// private

		/** 
   * validates arguments passed in constructor
   **/

	}, {
		key: '_validateInitialization',
		value: function _validateInitialization() {
			if (!this._uploadIdEndpoint) {
				throw new Error('A valid endpoint to retrieve an upload identifier is required');
			} else if (!this._uploadEndpoint) {
				throw new Error('A valid endpoint to retrieve an upload identifier is required');
			}
		}
	}]);

	return ChunkedClientUploader;
}();

exports.default = A;
