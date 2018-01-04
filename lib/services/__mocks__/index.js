const moment = require('moment');

module.exports = {
  routes:{
    getStopsForRouteByRouteType: jest.fn((config, data) => {
      if(data.route_type === "ERROR"){
       return Promise.reject("Error fetching routes and stops");
      }
      return Promise.resolve(data);
    })
  },
	departures: {
		getDepartureByStopForRoute: jest.fn((config, data) => {
			if(data.route_id === "0"){
				return Promise.resolve({departures: [], disruptions: []});
			}
			if(data.route_id === "1"){
				return Promise.resolve({departures: [
					{route_id: 5, stop_id: 1155, id: 1,  scheduled_departure_utc: "2017-12-12T03:18:00Z", platform_number: "1"},
					{route_id: 5, stop_id: 1155, id: 2, scheduled_departure_utc: "2017-12-12T03:18:00Z", platform_number: "1"},
					{route_id: 5, stop_id: 1155, id: 3, scheduled_departure_utc:  moment.utc().add(10, 'minutes'), platform_number: "1"},
					{route_id: 5, stop_id: 1155, id: 4, scheduled_departure_utc: "2017-12-12T03:18:00Z", platform_number: "1"},
					{route_id: 5, stop_id: 1155, id: 5, scheduled_departure_utc: moment.utc().add(8, 'minutes'), platform_number: "1"},
					{route_id: 5, stop_id: 1155, id: 6, scheduled_departure_utc: "2017-12-12T03:18:00Z", platform_number: "1"},
					{route_id: 5, stop_id: 1155, id: 7, scheduled_departure_utc: moment.utc().add(11, 'minutes'), platform_number: "1"}
				], disruptions: []});
			}
			if(data.route_id === "3"){
				return Promise.reject('Error fetching Next Train');
			}
			return Promise.resolve({departures: [], disruptions: []});

		})
	}
}
