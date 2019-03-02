'use strict';

const parseM3u8 = require('.');
const test = require('tape');

test('parseM3u8()', t => {
	t.deepEqual(
		parseM3u8(`#EXTM3U
#EXTINF:123
sample file.mp3`).segments,
		[
			{
				duration: 123,
				uri: 'sample file.mp3',
				timeline: 0
			}
		],
		'should parse M3U8 file contents.'
	);

	t.deepEqual(
		parseM3u8(`#EXTM3U
#EXTINF:419,AAA - BBB
example.mp3`, {baseUri: 'https://example.org/foo/bar/'}).segments,
		[
			{
				duration: 419,
				uri: 'https://example.org/foo/bar/example.mp3',
				timeline: 0
			}
		],
		'should rebase segment URLs with `baseUri` option.'
	);

	t.deepEqual(
		parseM3u8(`#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=300000
a.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=600000
b.m3u8`, {baseUri: new URL('https://example.org')}).playlists,
		[
			{
				attributes: {
					BANDWIDTH: 300000
				},
				uri: 'https://example.org/a.m3u8',
				timeline: 0
			},
			{
				attributes: {
					BANDWIDTH: 600000
				},
				uri: 'https://example.org/b.m3u8',
				timeline: 0
			}
		],
		'should rebase playlist URLs with `baseUri` option.'
	);

	t.throws(
		() => parseM3u8(new Set()),
		/^TypeError.*Expected an M3U8 file contents \(<string>\), but got a non-string value Set \{\}\./u,
		'should throw an error when the first argument is not a string.'
	);

	t.throws(
		() => parseM3u8('', new Uint32Array()),
		/^TypeError.*Expected a parse-m3u8 options object \(<Object>\), but got Uint32Array \[\]\./u,
		'should throw an error when the second argument is not a plain object.'
	);

	t.throws(
		() => parseM3u8('', {baseUri: -0}),
		/^TypeError.*Expected `baseUri` option to be either a <URL> or a <string> of a URL, but got -0 \(number\)\./u,
		'should throw an error when `baseUri` option is neither string nor URL.'
	);

	t.throws(
		() => parseM3u8('', {baseUri: '\t\n'}),
		/^TypeError.*Expected `baseUri` option to be either a <URL> or a <string> of a URL, but got an invalid URL string '\\t\\n'\./u,
		'should throw an error when `baseUri` option is an invalid URL string.'
	);

	t.throws(
		() => parseM3u8(),
		/^RangeError.*Expected 1 or 2 arguments \(<string>\[, <Object>\]\), but got no arguments\./u,
		'should throw an error when it takes no arguments.'
	);

	t.throws(
		() => parseM3u8('', {}, {}),
		/^RangeError.*Expected 1 or 2 arguments \(<string>\[, <Object>\]\), but got 3 arguments\./u,
		'should throw an error when it takes too many arguments.'
	);

	t.end();
});
