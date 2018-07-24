'use strict';

const URLConstructor = global.URL || require('url').URL; // eslint-disable-line node/prefer-global/url
const {inspect} = require('util');

const {Parser} = require('m3u8-parser');
const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');

const URI_ERROR = 'Expected `baseUri` option to be either a <URL> or a <string> of a URL';

module.exports = function parseM3u8(...args) {
	const argLen = args.length;

	if (argLen !== 1 && argLen !== 2) {
		throw new RangeError(`Expected 1 or 2 arguments (<string>[, <Object>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const [str, options = {}] = args;

	if (typeof str !== 'string') {
		const error = new TypeError(`Expected an M3U8 file contents (<string>), but got a non-string value ${
			inspectWithKind(str)
		}.`);
		error.code = 'ERR_INVALID_ARG_TYPE';

		throw error;
	}

	if (argLen === 2) {
		if (!isPlainObj(options)) {
			throw new TypeError(`Expected a parse-m3u8 options object (<Object>), but got ${
				inspectWithKind(options)
			}.`);
		}

		const {baseUri} = options;

		if (typeof baseUri === 'string') {
			try {
				new URLConstructor(baseUri);
			} catch (err) {
				err.message = `${URI_ERROR}, but got an invalid URL string ${inspect(baseUri)}.`;
				throw err;
			}
		} else if (baseUri !== undefined && !(baseUri instanceof URLConstructor)) {
			throw new TypeError(`${URI_ERROR}, but got ${inspectWithKind(baseUri)}.`);
		}
	}

	const parser = new Parser();

	parser.push(str);
	parser.end();

	const {manifest} = parser;

	if (options.baseUri !== undefined) {
		for (const item of [...manifest.playlists || [], ...manifest.segments]) {
			item.uri = new URLConstructor(item.uri, options.baseUri).toString();
		}
	}

	return manifest;
};
