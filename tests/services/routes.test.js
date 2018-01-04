
const mockGet = jest.fn(input => { 
  if(input.includes("stops/route/5/route_type/0")){
    return Promise.resolve(`{"stops": []}`);
  } else if(input.includes("stops/route/1/route_type/0")){
    return Promise.resolve(`{"stops": [{"stop_name": "Sothern Cross", "stop_id": 1120, "stop_latitude": 0, "stop_longitude": 0 }, {"stop_name": "Flinders", "stop_id": 1100, "stop_latitude": 0, "stop_longitude": 0 }] }`);
  }  else if(input.includes("routes?route_types=0")){
    return Promise.resolve(`{"routes": [{ "route_type": 0, "route_id": 5, "route_name": "South Morang Line", "route_number": "Dummy number 1" }, {"route_type": 0, "route_id": 1, "route_name": "Glen Waverley Line", "route_number": "Dummy number 2" } ]}`);
  } else if(input.includes("routes?route_types=ERROR_STOPS")){
    return Promise.resolve(`{"routes": [{ "route_type": "ERROR_STOPS", "route_id": 1, "route_name": "Error Line", "route_number": "Dummy number 1" }, {"route_type": 0, "route_id": 1, "route_name": "Glen Waverley Line", "route_number": "Dummy number 2" } ]}`);
  }  else if(input.includes("routes?route_types=ERRORS")){
    return Promise.reject('ERROR');
  } else if(input.includes("stops/route/1/route_type/ERROR_STOPS")){
    return Promise.reject('ERROR_STOPS');
  }else {
    return Promise.resolve(`{"stops": []}`);
  }
});

jest.mock('request-promise', () => ({
  get: mockGet
}));

const {getStopsForRouteByRouteType} = require('../../lib/services/routes');
const config = {
  api: {
    BASE_URL: 'TEST_URL',
    APP_KEY: 'MY_APP_KEY',
    APP_USER: 'MY_APP_USER'
  }

}
describe('should have module routes which : ', () => {

  afterEach(() => {
    mockGet.mockClear();
  });

  describe('should have method to fetch Routes and Stops By Route Type', () => {

    it('should properly format the request url with signature, devid', () => {
      const route_type = '0';
      const convRequestUrl = 'TEST_URL/v3/routes?route_types=0&devid=MY_APP_USER&signature=226ef6f73c1c64acdcb4f239f0db086a219e7048';
      expect.assertions(2);
      return getStopsForRouteByRouteType(config, { route_type }).then(data => {
        expect(mockGet).toHaveBeenCalled();		     
        expect(mockGet).toHaveBeenCalledWith(convRequestUrl);		     
      });
    })

    it('should properly format the request url with signature, devid  to passed in value', () => {
      const route_type = '0';
      const convRequestUrl = 'TEST_URL/v3/routes?route_types=0&devid=MY_APP_USER&signature=226ef6f73c1c64acdcb4f239f0db086a219e7048';

      expect.assertions(2);
      return getStopsForRouteByRouteType(config, { route_type }).then(data => {
        expect(mockGet).toHaveBeenCalled();		     
        expect(mockGet).toHaveBeenCalledWith(convRequestUrl);		     
      });
    })

    it('should return stops and routes', () => {
      const route_type = '0';
      const convRequestUrl = 'TEST_URL/v3/routes?route_types=0&devid=MY_APP_USER&signature=226ef6f73c1c64acdcb4f239f0db086a219e7048';

      expect.assertions(1);
      return getStopsForRouteByRouteType(config, { route_type }).then(data => {
        expect(data).toEqual({ routes:
                 [ { route_type: 0,
                     route_id: 5,
                     route_name: 'South Morang Line',
                     route_number: 'Dummy number 1',
                     stops: [] },
                   { route_type: 0,
                     route_id: 1,
                     route_name: 'Glen Waverley Line',
                     route_number: 'Dummy number 2',
                     stops: [{
                       stop_id: 1120, 
                       stop_latitude: 0, 
                       stop_longitude: 0, 
                       stop_name: "Sothern Cross"
                     }, 
                       {
                         stop_id: 1100, 
                         stop_latitude: 0, 
                         stop_longitude: 0, 
                         stop_name: "Flinders"
                       }]
                   } 
                 ] });		     
      });
    })

    it('should return empty routes on Error fetching routes', () => {
      const route_type = 'ERRORS';
      const convRequestUrl = 'TEST_URL/v3/routes?route_types=ERRORS&devid=MY_APP_USER&signature=5d2fa525782eaabaab45a406a3b11d9a20ec0844';

      expect.assertions(2);
      return getStopsForRouteByRouteType(config, { route_type }).then(data => {
        expect(mockGet).toHaveBeenCalledWith(convRequestUrl);		     
        expect(data).toEqual({ routes: [] });		     
      });
    })

    it('should return empty stops and routes on Error fetching stops', () => {
      const route_type = 'ERROR_STOPS';
      const convRequestUrl = 'TEST_URL/v3/stops/route/1/route_type/ERROR_STOPS?devid=MY_APP_USER&signature=33bd031d1f6e61ef75f0126114eef698d216cd99';

      expect.assertions(2);
      return getStopsForRouteByRouteType(config, { route_type }).then(data => {
        expect(mockGet).toHaveBeenCalledWith(convRequestUrl);		     
        expect(data).toEqual({ routes:
                 [ { route_type: 'ERROR_STOPS',
                     route_id: 1,
                     route_name: 'Error Line',
                     route_number: 'Dummy number 1',
                   stops: [] },
                   {
                     route_id: 1,
                     route_type: 0,
                     route_name: "Glen Waverley Line",
                     route_number: "Dummy number 2",
                     stops: []
                   }
                 ] });		     
      });
    })

  })

})

