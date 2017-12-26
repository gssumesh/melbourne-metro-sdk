const _ = require('lodash');
const moment = require('moment');
const {departures} = require('./services');
const melbourneMetro = {};

const init = config => {
	melbourneMetro.config = config;
  return melbourneMetro ; 
}

melbourneMetro.nextTrain = ({route_type, stop_id, route_id}) => {
	
	return departures.getDepartureByStopForRoute(melbourneMetro.config, {route_type, stop_id, route_id}) 
    .then(resp => ({
      departures: _.reduce(resp.departures, (latestTrainItem, item) => {
			const diffFromCurrentTime = moment.utc().diff(item.scheduled_departure_utc, 'seconds');
			const diffFromLatestTrain = moment.utc(latestTrainItem.scheduled_departure_utc)
				.diff(item.scheduled_departure_utc, 'seconds');
			return diffFromCurrentTime < 0 && diffFromLatestTrain >= 0 
				? item : latestTrainItem;
      }, {id: 0,scheduled_departure_utc: moment.utc().add(2, 'days'), platform_number: 0}),
      disruptions: resp.disruptions
    }) )
		.catch(e => {
			console.log(e);
			return Promise.reject(e);
		});
};

module.exports = {
	init,
	config: {
		api: {
			BASE_URL: 'sample_base_url',
			APP_KEY: 'sample_app_key',
			APP_USER: 'sample_app_user'
		}
	}
};
