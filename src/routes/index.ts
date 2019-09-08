import productRoutes from './product';
import userRoutes from './user';
import adminRoutes from './admin';
import vehicleRoutes from './vehicle';

export default [...productRoutes, ...userRoutes, ...adminRoutes, ...vehicleRoutes];

