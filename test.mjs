import {strict as assert} from 'assert';

import parseM3u8 from '.';
import test from 'testit';

test('parse M3U8 file contents', () => {
	assert.deepEqual(
		parseM3u8(`#EXTM3U
#EXTINF:123
sample file.mp3`).segments,
		[
			{
				duration: 123,
				uri: 'sample file.mp3',
				timeline: 0
			}
		]
	);
});

test('rebase segment URLs with `baseUri` option', () => {
	assert.deepEqual(
		parseM3u8(`#EXTM3U
#EXTINF:419,AAA - BBB
example.mp3`, {baseUri: 'https://example.org/foo/bar/'}).segments,
		[
			{
				duration: 419,
				uri: 'https://example.org/foo/bar/example.mp3',
				timeline: 0
			}
		]
	);
});

test('rebase playlist URLs with `baseUri` option', () => {
	assert.deepEqual(
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
		]
	);
});

test('throw an error when the first argument is not a string', () => {
	assert.throws(() => parseM3u8(new Set()), {
		name: 'TypeError',
		message: 'Expected an M3U8 file contents (<string>), but got a non-string value Set {}.'
	});
});

test('throw an error when the second argument is not a plain Object', () => {
	assert.throws(() => parseM3u8('', new Uint32Array()), {
		name: 'TypeError',
		message: 'Expected a parse-m3u8 options object (<Object>), but got Uint32Array [].'
	});
});

test('throw an error when `baseUri` option is neither string nor URL', () => {
	assert.throws(() => parseM3u8('', {baseUri: -0}), {
		name: 'TypeError',
		message: 'Expected `baseUri` option to be either a <URL> or a <string> of a URL, but got -0 (number).'
	});
});

test('throw an error when `baseUri` option is an invalid URL string', () => {
	assert.throws(() => parseM3u8('', {baseUri: '\t\n'}), {
		name: 'TypeError',
		message: 'Expected `baseUri` option to be either a <URL> or a <string> of a URL, but got an invalid URL string \'\\t\\n\'.'
	});
});

test('throw an error when it takes no arguments', () => {
	assert.throws(() => parseM3u8(), {
		name: 'RangeError',
		message: 'Expected 1 or 2 arguments (<string>[, <Object>]), but got no arguments.'
	});
});

test('throw an error when it takes too many arguments', () => {
	assert.throws(() => parseM3u8('', {}, {}), {
		name: 'RangeError',
		message: 'Expected 1 or 2 arguments (<string>[, <Object>]), but got 3 arguments.'
	});
});
