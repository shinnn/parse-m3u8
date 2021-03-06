# parse-m3u8

[![npm version](https://img.shields.io/npm/v/parse-m3u8.svg)](https://www.npmjs.com/package/parse-m3u8)
[![GitHub Actions](https://action-badges.now.sh/shinnn/parse-m3u8)](https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/results/shinnn/parse-m3u8)
[![codecov](https://codecov.io/gh/shinnn/parse-m3u8/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/parse-m3u8)

A [Node.js](https://nodejs.org/) module to parse [M3U8](https://en.wikipedia.org/wiki/M3U#M3U8)

```javascript
const parseM3u8 = require('parse-m3u8');

parseM3u8(`#EXTM3U
#EXT-X-TARGETDURATION:10
#EXTINF:10,
0.ts
#EXTINF:20,
1.ts
`).segments; /*=>  [
  {
    duration: 10,
    uri: '0.ts',
    timeline: 0
  },
  {
    duration: 20,
    uri: '1.ts',
    timeline: 0
  }
] */
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install parse-m3u8
```

## API

```javascript
const parseM3u8 = require('parse-m3u8');
```

### parseM3u8(*contents* [, *option*])

*contents*: `string`  
*option*: `Object`  
Return: `Object`

It parses a given `string` with [m3u8-parser](https://github.com/videojs/m3u8-parser) and returns a [result `Object`](https://github.com/videojs/m3u8-parser#parsed-output).

#### option.baseUri

Type: `string | URL`

Rebase `uri` properties of each items in `playlists` and `segments` to this URL.

```javascript
const source = `#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=300000
low.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=600000
high.m3u8`;

parseM3u8(source).playlists; /*=> [
  {
    attributes: {BANDWIDTH: 300000},
    uri: 'low.m3u8',
    timeline: 0
  },
  {
    attributes: {BANDWIDTH: 600000},
    uri: 'high.m3u8',
    timeline: 0
  }
] */

parseM3u8(source, {baseUri: 'https://example.org/assets/playlists/'}).playlists; /*=> [
  {
    attributes: {BANDWIDTH: 300000},
    uri: 'https://example.org/assets/playlists/low.m3u8',
    timeline: 0
  },
  {
    attributes: {BANDWIDTH: 600000},
    uri: 'https://example.org/assets/playlists/high.m3u8',
    timeline: 0
  }
] */
```

## License

[ISC License](./LICENSE) © 2018 - 2019 Watanabe Shinnosuke
