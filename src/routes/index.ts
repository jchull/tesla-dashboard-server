import {getUserRoutes} from './user';
import adminRoutes from './admin';
import {getVehicleRoutes} from './vehicle';
import {Route} from '../util';

export function getRoutes(services:any): Route[]{
  return [...getUserRoutes(services), ...adminRoutes, ...getVehicleRoutes(services)] as Route[];
}

