const request = require('request-promise');
const _ = require('lodash');
const crypto = require('crypto');

const getSignature = (request, apiKey) => crypto.createHmac('sha1', apiKey).update(request).digest('hex').toString();

const getStopsByRouteId = (config, {route_type, route_id}) => {
 
  const requestUri = `/v3/stops/route/${route_id}/route_type/${route_type}?devid=${config.api.APP_USER}`;
  const signature = getSignature(requestUri, config.api.APP_KEY);
	const requestUriWithSign = config.api.BASE_URL + `${requestUri}&signature=${signature}`;
 
  return request.get(requestUriWithSign)
    .then(resp => {
      return resp;
    }).catch(err => {
      console.log(err);
     return `{"stops": []}`;
    })
}


const getStopsForRouteByRouteType =  (config, {route_type} ) => {
	
  const requestUri = `/v3/routes?route_types=${route_type}&devid=${config.api.APP_USER}`;
  const signature = getSignature(requestUri, config.api.APP_KEY);
	const requestUriWithSign = config.api.BASE_URL + `${requestUri}&signature=${signature}`;

	return request.get(requestUriWithSign)
    .then( routeRawResult => {
     const routeResult = JSON.parse(routeRawResult); 
      const getAllStopsPromise = _.map(routeResult.routes,(route, index) => getStopsByRouteId(config, {route_type, route_id: route.route_id})); 
      return Promise.all(getAllStopsPromise).then(stopsArray => {
        _.forEach(stopsArray, (stopsList, index) => {
         routeResult.routes[index].stops = JSON.parse(stopsList).stops
        });
       return routeResult;
      }) 
})
		.catch(e => {
			console.log(e);
			return {
				routes: []
			};
		});
}


module.exports = {
getStopsForRouteByRouteType	
};
