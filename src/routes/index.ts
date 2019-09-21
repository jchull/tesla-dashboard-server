import productRoutes from './product';
import userRoutes from './user';
import adminRoutes from './admin';
import vehicleRoutes from './vehicle';
import {Route} from '../util';

export default [...productRoutes, ...userRoutes, ...adminRoutes, ...vehicleRoutes] as Route[];

