const request = require('request-promise');
const _ = require('lodash');
const crypto = require('crypto');

const getSignature = (request, apiKey) => crypto.createHmac('sha1', apiKey).update(request).digest('hex').toString();

const getDepartureByStopForRoute =  (config, {route_type, stop_id, route_id, max_results} ) => {
	max_results = max_results ? max_results : 10;
	const requestUri = `/v3/departures/route_type/${route_type}/stop/${stop_id}/route/${route_id}?max_results=${max_results}&devid=${config.api.APP_USER}`;
	const signature = getSignature(requestUri, config.api.APP_KEY);
	const requestUriWithSign = config.api.BASE_URL + `${requestUri}&signature=${signature}`;

	return request.get(requestUriWithSign)
		.then( resp => ({
			departures: _.filter(JSON.parse(resp).departures, item => (item.route_id===parseInt(route_id) && item.stop_id===parseInt(stop_id))),
			disruptions: resp.disruptions
		}))
		.catch(e => {
			console.log(e);
			return {
				departures: [],
				disruptions: {}
			};
		});
}


module.exports = {
	getDepartureByStopForRoute
};
