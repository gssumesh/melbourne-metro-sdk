const mockGet = jest.fn(input => { 
	if(input.includes("route_type/0/")){
		return Promise.resolve(`{"departures": []}`);
	} else if(input.includes("route_type/1/")){
		return Promise.resolve(`{"departures": [{"route_id": 5, "stop_id": 1155}, {"route_id": 5, "stop_id": 2222}]}`);
	} else if(input.includes("route_type/2/")){
		return Promise.reject('ERROR');
	} else{
		return Promise.resolve(`{"departures": []}`);
	}
});

jest.mock('request-promise', () => ({
	get: mockGet
}));

const {getDepartureByStopForRoute} = require('../../lib/services/departures');
const config = {
	api: {
		BASE_URL: 'TEST_URL',
		APP_KEY: 'MY_APP_KEY',
		APP_USER: 'MY_APP_USER'
	}

}
describe('should have module departures which : ', () => {

	afterEach(() => {
		mockGet.mockClear();
	});

	describe('should have method to fetch Departures By Stop For a Route', () => {

		it('should properly format the request url with signature, devid', () => {
			const stop_id = '1155';
			const route_type = '0';
			const route_id = '5';
			const convRequestUrl = 'TEST_URL/v3/departures/route_type/0/stop/1155/route/5?max_results=10&devid=MY_APP_USER&signature=3fd0f5893fce35bb4ecec16e9d0caea8ea0193b6';

			expect.assertions(2);
			return getDepartureByStopForRoute(config, { route_type, stop_id, route_id }).then(data => {
				expect(mockGet).toHaveBeenCalled();		     
				expect(mockGet).toHaveBeenCalledWith(convRequestUrl);		     
			});
		})

		it('should properly format the request url with signature, devid and max_result to passed in value', () => {
			const stop_id = '1155';
			const route_type = '0';
			const route_id = '5';
			const max_results= '20';
			const convRequestUrl = 'TEST_URL/v3/departures/route_type/0/stop/1155/route/5?max_results=20&devid=MY_APP_USER&signature=a3d6635d850d95da200f6dcca850f3e946ca19f1';

			expect.assertions(2);
			return getDepartureByStopForRoute(config, { route_type, stop_id, route_id, max_results }).then(data => {
				expect(mockGet).toHaveBeenCalled();		     
				expect(mockGet).toHaveBeenCalledWith(convRequestUrl);		     
			});
		})

		it('should filter result will matching route_id and stop_id', () => {
			const stop_id = '1155';
			const route_type = '1';
			const route_id = '5';

			expect.assertions(3);
			return getDepartureByStopForRoute(config, { route_type, stop_id, route_id }).then(data => {
				expect(mockGet).toHaveBeenCalled();		     
				expect(data.departures.length).toEqual(1);
				expect(data.departures[0].route_id).toEqual(5);
			});
		})

		it('should return empty departures on error', () => {
			const stop_id = '1155';
			const route_type = '2';
			const route_id = '5';

			expect.assertions(2);
			return getDepartureByStopForRoute(config, { route_type, stop_id, route_id }).then(data => {
				expect(mockGet).toHaveBeenCalled();		     
				expect(data.departures.length).toEqual(0);
			});
		})
	})

})

