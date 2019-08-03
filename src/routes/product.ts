import {Request, Response} from 'express';

const routes = [
  {
    path: '/product',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      res.send([
        {
          name: 'Tesla 1',
          color: '#9f0405',
          id: '12345678',
          model: 'm3',
          type: 'CAR'
        },
        {
          name: 'Tesla 2',
          color: '#303f9f',
          id: '36278198',
          model: 's',
          type: 'CAR'
        },
        {
          name: 'PowerWall 1',
          color: '#444444',
          id: '3338272',
          model: '123',
          type: 'POWERWALL'
        }
      ]);
    }
  },
  {
    path: '/product/:productId/charging',
    method: 'get',
    handler: async (req: Request, res: Response) => {

      const session = req.query.session;
      const productId = req.params.productId;

      console.log('got query for session: ' + session);
      return res.send(JSON.stringify([
            {
              chargingState: 'Charging',
              chargerPower: 5,
              batteryLevel: 76,
              batteryRangeIdeal: 276.79,
              batteryRangeEst: 100.79,
              energyAdded: 21.22,
              rangeAddedIdeal: 86.5,
              rangeAddedEst: 90,
              maxCurrent: 24,
              requestedCurrent: 23,
              actualCurrent: 23,
              timeToFull: 1.17,
              chargeRate: 19.5,
              timestamp: new Date('2019-07-20T15:55:42.909Z').valueOf()
            },
            {
              chargingState: 'Charging',
              chargerPower: 150,
              batteryLevel: 78,
              batteryRangeIdeal: 276.79,
              batteryRangeEst: 140.79,
              energyAdded: 21.22,
              rangeAddedIdeal: 86.5,
              rangeAddedEst: 90,
              maxCurrent: 24,
              requestedCurrent: 23,
              actualCurrent: 23,
              timeToFull: 1.17,
              chargeRate: 19.5,
              timestamp: new Date('2019-07-20T16:00:00.000Z').valueOf()
            },
            {
              chargingState: 'Charging',
              chargerPower: 120,
              batteryLevel: 81,
              batteryRangeIdeal: 276.79,
              batteryRangeEst: 190.79,
              energyAdded: 21.22,
              rangeAddedIdeal: 89.5,
              rangeAddedEst: 92,
              maxCurrent: 24,
              requestedCurrent: 23,
              actualCurrent: 23,
              timeToFull: 1,
              chargeRate: 19.1,
              timestamp: new Date('2019-07-20T16:05:00.000Z').valueOf()

            },
            {
              chargingState: 'Charging',
              chargerPower: 50,
              batteryLevel: 85,
              batteryRangeIdeal: 276.79,
              batteryRangeEst: 280.79,
              energyAdded: 21.22,
              rangeAddedIdeal: 89.5,
              rangeAddedEst: 92,
              maxCurrent: 24,
              requestedCurrent: 23,
              actualCurrent: 23,
              timeToFull: 1,
              chargeRate: 19.1,
              timestamp: new Date('2019-07-20T16:10:00.000Z').valueOf()

            }
          ]
      ));
    }
  }
];

export default [...routes];
