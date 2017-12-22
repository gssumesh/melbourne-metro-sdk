jest.mock('../lib/services');
const {init, config} = require('../lib');
const {departures} = require('../lib/services');

describe('Class: MelbourneMetroSDK', () => {

	it('should return signed config', () => {
		const app_key = 'MY_APP_KEY';
		const app_secret = 'MY_APP_SECRET';

		const initResp = init({app_key, app_secret});
		expect(initResp.config.app_key).toEqual(app_key);
		expect(initResp.config.app_secret).toEqual(app_secret);
	})

	it('should have nextTrain() method which call metro departure api and give the result', () => {
		// config = {};
		const stop_id = '1155';
		const route_type = '0';
		const route_id = '0';
		const app_key = 'MY_APP_KEY';
		const app_secret = 'MY_APP_SECRET';


		const initResp = init({app_key, app_secret});
		expect.assertions(2);
		return initResp.nextTrain({ route_type, stop_id, route_id }).then(data => {
			expect(departures.getDepartureByStopForRoute).toHaveBeenCalled();
			expect(departures.getDepartureByStopForRoute).toHaveBeenCalledWith(initResp.config, { route_type, stop_id, route_id });
		});	
	})


	it('should have nextTrain() method which return default train from api result when api result is empty', () => {
		//config = {};
		const stop_id = '1155';
		const route_type = '0';
		const route_id = '0';
		const app_key = 'MY_APP_KEY';
		const app_secret = 'MY_APP_SECRET';


		const initResp = init({app_key, app_secret});
		expect.assertions(1);
		return initResp.nextTrain({ route_type, stop_id, route_id }).then(data => {
			expect(data.id).toEqual(0); 
		});	

	})

	it('should have nextTrain() method which fetches latest train from api result', () => {
		//config = {};
		const stop_id = '1155';
		const route_type = '0';
		const route_id = '1';
		const app_key = 'MY_APP_KEY';
		const app_secret = 'MY_APP_SECRET';


		const initResp = init({app_key, app_secret});
		expect.assertions(1);
		return initResp.nextTrain({ route_type, stop_id, route_id }).then(data => {
			expect(data.id).toEqual(5); 
		});	

	})

	it('should have nextTrain() method which captures error and return error on failure', () => {
		const stop_id = '1155';
		const route_type = '0';
		const route_id = '3';
		const app_key = 'MY_APP_KEY';
		const app_secret = 'MY_APP_SECRET';
		const initResp = init({app_key, app_secret});
		expect.assertions(1);
		return initResp.nextTrain({ route_type, stop_id, route_id }).catch(e => {
			expect(e).toEqual('Error fetching Next Train'); 
		});	

	})
})
