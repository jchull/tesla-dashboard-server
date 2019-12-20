import {getUserRoutes} from './user';
import adminRoutes from './admin';
import {getVehicleRoutes} from './vehicle';
import {Route} from '../util';
import {getSystemRoutes} from './system';
import {ServicesType} from '../services';

export function getRoutes(services: ServicesType): Route[] {
  return [...getUserRoutes(services), ...adminRoutes, ...getVehicleRoutes(services), ...getSystemRoutes(services)] as Route[];
}

