var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  return res.send(JSON.stringify([
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
    ]
  ));
});


router.get('/:productId/charging', function (req, res, next) {
  var session = req.query.session;
  var productId = req.params.productId;

  console.log('got query for session: ' + session);
  return res.send(JSON.stringify([
      {
        chargingState: 'Charging',
        chargerPower: 5,
        batteryLevel: 76,
        batteryRangeIdeal: 276.79,
        batteryRangeEst: 276.79,
        energyAdded: 21.22,
        rangeAddedIdeal: 86.5,
        rangeAddedEst: 90,
        maxCurrent: 24,
        requestedCurrent: 23,
        actualCurrent: 23,
        timeToFull: 1.17,
        chargeRate: 19.5,
        timestamp: new Date()
      },
      {
        chargingState: 'Charging',
        chargerPower: 5,
        batteryLevel: 78,
        batteryRangeIdeal: 276.79,
        batteryRangeEst: 276.79,
        energyAdded: 21.22,
        rangeAddedIdeal: 86.5,
        rangeAddedEst: 90,
        maxCurrent: 24,
        requestedCurrent: 23,
        actualCurrent: 23,
        timeToFull: 1.17,
        chargeRate: 19.5,
        timestamp: new Date(new Date().valueOf() - 10000)
      },
      {
        chargingState: 'Charging',
        chargerPower: 5,
        batteryLevel: 81,
        batteryRangeIdeal: 276.79,
        batteryRangeEst: 276.79,
        energyAdded: 21.22,
        rangeAddedIdeal: 89.5,
        rangeAddedEst: 92,
        maxCurrent: 24,
        requestedCurrent: 23,
        actualCurrent: 23,
        timeToFull: 1,
        chargeRate: 19.1,
        timestamp: new Date(new Date().valueOf() - 20000)
      }
    ]
  ));
});

module.exports = router;
