# melbourne-metro-sdk

[![Coverage Status](https://coveralls.io/repos/github/gssumesh/melbourne-metro-sdk/badge.svg?branch=master)](https://coveralls.io/github/gssumesh/melbourne-metro-sdk?branch=master)
[![Build Status](https://travis-ci.org/gssumesh/melbourne-metro-sdk.svg?branch=master)](https://travis-ci.org/gssumesh/melbourne-metro-sdk)

A reference implementation for Melbourne Metro SDK v3. It tries to fetch next train information calling Metro SDK based on the API keys provided.

## `npm run` scripts

* `npm run test`: Runs jest tests once
* `npm run cover`: Runs jest code

## Installation

* `npm install melbourne-metro-sdk`

## Usage

```
const melbourneMetro = require('melbourne-metro-sdk');
melbourneMetro.init({
		api: {
			BASE_URL: 'sample_base_url',
			APP_KEY: 'sample_app_key',
			APP_USER: 'sample_app_user'
		}
	}).nextTrain({
 route_id: 5,
 route_type: 0,
 stop_id: 1155
}).then(data => console.log(data)).catch(e => console.log(e)); 

```
## Methods Supported

* nextTrain({route_id, route_type, stop_id}) => Promise with next Train details
