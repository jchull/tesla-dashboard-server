import {TeslaOwnerService} from './OwnerService';
import {PersistenceService} from './PersistenceService';


// const ownerService = new TeslaOwnerService(config.OWNER_BASE_URL, config.TESLA_CLIENT_ID, config.TESLA_CLIENT_SECRET);
//
// // TODO: use locally-stored token if-available and unexpired
// ownerService.authenticate(config.TESLA_AUTH_EMAIL, process.env.TESLA_AUTH_PASSWORD)
//
//             // TODO: store vehicles locally to avoid calling this every time the service starts
//             .then(() => ownerService.getVehicles())
//
//             // TODO: handle multiple vehicles
//             .then(vehicleList => vehicleList && vehicleList.data && vehicleList.data.response && vehicleList.data.response[0].id_s)
//             .then(vehicleId => beginPolling(process.env.POLLING_INTERVAL, vehicleId));
//
//
// const beginPolling = (pollingInterval, vehicleId) => {
//   const handler = getUpdateHandler(vehicleId);
//   handler();
//   setInterval(handler, pollingInterval);
// };
//
// // TODO: watchdog to prevent missing data due to running out of memory or other possible nasties
// const getUpdateHandler = vehicleId => {
//   return () => {
//     return ownerService.getState(vehicleId)
//                        .then(vehicleData => persistenceService.postState(vehicleData),
//                            error => console.log(error));
//   };
// };

