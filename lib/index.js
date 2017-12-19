const _ = require('lodash');
const moment = require('moment');
const {departures} = require('./services');

const init = config => {
	this.config = config;
	return this;
}

const nextTrain = ({route_type, stop_id, route_id}) => {
	const config = this.config;	
	return departures.getDepartureByStopForRoute(config, {route_type, stop_id, route_id}) 
		.then(resp => _.reduce(resp.departures, (latestTrainItem, item) => {
			const diffFromCurrentTime = moment.utc().diff(item.scheduled_departure_utc, 'seconds');
			const diffFromLatestTrain = moment.utc(latestTrainItem.scheduled_departure_utc)
				.diff(item.scheduled_departure_utc, 'seconds');
			return diffFromCurrentTime < 0 && diffFromLatestTrain >= 0 
				? item : latestTrainItem;
		}, {id: 0,scheduled_departure_utc: moment.utc().add(2, 'days')}) )
		.catch(e => {
			console.log(e);
			return Promise.reject(e);
		});
};

module.exports = {
	init,
	nextTrain,
	config: {
		api: {
			BASE_URL: 'sample_base_url',
			APP_KEY: 'sample_app_key',
			APP_USER: 'sample_app_user'
		}
	}
};
